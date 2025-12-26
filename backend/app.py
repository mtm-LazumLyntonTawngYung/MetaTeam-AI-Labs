#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
InsightFace Computer Vision API
Flask-based REST API for face analysis using InsightFace
"""

import os
import logging
import base64
import io
import numpy as np
import cv2
import json
from pathlib import Path
import tempfile
import zipfile
from PIL import Image, ImageDraw, ImageFont
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_distances
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.serving import run_simple

# InsightFace imports
try:
    from insightface.app import FaceAnalysis
    import insightface
    logger = logging.getLogger(__name__)
    logger.info("InsightFace available")
except ImportError as e:
    logger = logging.getLogger(__name__)
    logger.error(f"Failed to import InsightFace: {e}")
    FaceAnalysis = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = tempfile.mkdtemp()

# Global variables
_face_analysis = None
model_initialized = False
registered_students = {}

# Font setup for text drawing
FONT_PATHS = [
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
    "C:/Windows/Fonts/msgothic.ttc",
    "C:/Windows/Fonts/msmincho.ttc",
    "arial.ttf",
    "DejaVuSans.ttf",
]

def get_font(size=20):
    """Get PIL font with fallback"""
    for path in FONT_PATHS:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()

def ensure_model_directory():
    """Ensure model directory exists and is writable"""
    try:
        model_dir = Path.home() / ".insightface" / "models" / "buffalo_l"
        model_dir.parent.mkdir(parents=True, exist_ok=True)
        if not os.access(model_dir.parent, os.W_OK):
            logger.error(f"No write permission to model directory: {model_dir.parent}")
            return False
        logger.info(f"Model directory ready: {model_dir.parent}")
        return True
    except Exception as e:
        logger.error(f"Error ensuring model directory: {e}")
        return False

def verify_model_integrity():
    """Verify buffalo_l model integrity"""
    try:
        model_dir = Path.home() / ".insightface" / "models" / "buffalo_l"
        if not model_dir.exists():
            logger.warning("Model directory does not exist")
            return False

        required_files = [
            "det_10g.onnx",
            "genderage.onnx",
            "w600k_r50.onnx",
        ]

        for filename in required_files:
            filepath = model_dir / filename
            if not filepath.exists():
                logger.warning(f"Missing model file: {filename}")
                return False
            size_mb = filepath.stat().st_size / (1024 * 1024)
            if size_mb < 1.0:
                logger.warning(f"Model file {filename} is too small: {size_mb:.2f} MB")
                return False

        logger.info("Model integrity verification passed")
        return True
    except Exception as e:
        logger.error(f"Error verifying model integrity: {e}")
        return False

def get_face_analysis():
    """Get or initialize FaceAnalysis"""
    global _face_analysis, model_initialized
    if _face_analysis is None:
        if FaceAnalysis is None:
            raise ImportError("InsightFace is not available")

        logger.info("Initializing InsightFace FaceAnalysis...")

        if not ensure_model_directory():
            raise RuntimeError("Failed to ensure model directory permissions")

        if not verify_model_integrity():
            logger.warning("Model integrity check failed, but proceeding with initialization")

        _face_analysis = FaceAnalysis(
            name='buffalo_l',
            providers=['CPUExecutionProvider'],
            allowed_modules=['detection', 'recognition', 'genderage']
        )
        try:
            _face_analysis.prepare(ctx_id=-1, det_size=(640, 640))
            logger.info("InsightFace FaceAnalysis initialized")
            model_initialized = True
        except Exception as prepare_e:
            logger.error(f"Failed to prepare InsightFace model: {prepare_e}")
            raise
    return _face_analysis

def draw_text_on_image(image, text, position, font_size=20, color=(0, 255, 0)):
    """Draw text on OpenCV image using PIL"""
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_image)
    font = get_font(font_size)
    draw.text(position, text, font=font, fill=color)
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

def image_to_base64(image):
    """Convert OpenCV image to base64"""
    # Resize if too large to prevent browser issues
    height, width = image.shape[:2]
    max_size = 400  # Further reduced for better performance
    if width > max_size or height > max_size:
        scale = min(max_size / width, max_size / height)
        new_width = int(width * scale)
        new_height = int(height * scale)
        image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)

    _, buffer = cv2.imencode('.png', cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
    img_str = base64.b64encode(buffer).decode()
    return f"data:image/png;base64,{img_str}"

def load_registered_students():
    """Load registered students from file"""
    global registered_students
    try:
        if os.path.exists('registered_students.json'):
            with open('registered_students.json', 'r') as f:
                data = json.load(f)
                registered_students = {k: np.array(v) for k, v in data.items()}
                logger.info(f"Loaded {len(registered_students)} registered students")
    except Exception as e:
        logger.error(f"Error loading registered students: {e}")

def save_registered_students():
    """Save registered students to file"""
    try:
        with open('registered_students.json', 'w') as f:
            data = {k: v.tolist() if isinstance(v, np.ndarray) else v for k, v in registered_students.items()}
            json.dump(data, f)
    except Exception as e:
        logger.error(f"Error saving registered students: {e}")

# Load registered students on startup
load_registered_students()

def process_image_detection(image):
    """Process image for face detection"""
    try:
        face_analysis = get_face_analysis()
        results = face_analysis.get(image)

        output_image = image.copy()
        faces_info = []

        for i, face in enumerate(results):
            bbox = face.bbox.astype(int)
            cv2.rectangle(output_image, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)

            if hasattr(face, 'kps') and face.kps is not None:
                kps = face.kps.reshape(-1, 2).astype(int)
                for kp in kps:
                    cv2.circle(output_image, tuple(kp), 3, (0, 0, 255), -1)

            output_image = draw_text_on_image(output_image, f"Face {i}", (bbox[0], bbox[1] - 10),
                                             font_size=18, color=(0, 255, 0))

            faces_info.append({
                'id': i,
                'bbox': bbox.tolist(),
                'confidence': float(face.det_score) if hasattr(face, 'det_score') else 0.0
            })

        return output_image, f"Detected {len(results)} faces", faces_info

    except Exception as e:
        logger.error(f"Error in face detection: {e}")
        return image, f"Face detection error: {e}", []

def process_image_recognition(image):
    """Process image for face recognition and attributes"""
    try:
        face_analysis = get_face_analysis()
        results = face_analysis.get(image)

        output_image = image.copy()
        faces_info = []

        for i, face in enumerate(results):
            bbox = face.bbox.astype(int)
            cv2.rectangle(output_image, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)

            age = int(face.age) if hasattr(face, 'age') else 0
            gender = 'Female' if hasattr(face, 'gender') and face.gender == 1 else 'Male'

            label = f"Face {i}: {age}yo {gender}"
            output_image = draw_text_on_image(output_image, label, (bbox[0], bbox[1] - 10),
                                             font_size=14, color=(0, 255, 0))

            faces_info.append({
                'id': i,
                'bbox': bbox.tolist(),
                'age': age,
                'gender': gender,
                'embedding': face.embedding.tolist() if hasattr(face, 'embedding') else []
            })

        return output_image, f"Recognized {len(results)} faces", faces_info

    except Exception as e:
        logger.error(f"Error in face recognition: {e}")
        return image, f"Face recognition error: {e}", []

def calculate_similarity(embedding1, embedding2):
    """Calculate cosine similarity between embeddings"""
    try:
        emb1 = np.array(embedding1)
        emb2 = np.array(embedding2)
        similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
        return float(similarity)
    except Exception as e:
        logger.error(f"Error calculating similarity: {e}")
        return 0.0

def verify_faces(image1, image2, threshold=0.6):
    """Verify if two images contain the same person"""
    try:
        face_analysis = get_face_analysis()

        results1 = face_analysis.get(image1)
        results2 = face_analysis.get(image2)

        if len(results1) == 0 or len(results2) == 0:
            return None, "No faces detected in one or both images", 0.0, False

        embedding1 = results1[0].embedding
        embedding2 = results2[0].embedding

        similarity = calculate_similarity(embedding1, embedding2)
        is_same = similarity > threshold

        result1 = image1.copy()
        bbox1 = results1[0].bbox.astype(int)
        cv2.rectangle(result1, (bbox1[0], bbox1[1]), (bbox1[2], bbox1[3]), (0, 255, 0), 2)

        result2 = image2.copy()
        bbox2 = results2[0].bbox.astype(int)
        cv2.rectangle(result2, (bbox2[0], bbox2[1]), (bbox2[2], bbox2[3]), (0, 255, 0), 2)

        h1, w1 = result1.shape[:2]
        h2, w2 = result2.shape[:2]
        max_height = max(h1, h2)

        if h1 != max_height:
            result1 = cv2.resize(result1, (int(w1 * max_height / h1), max_height))
        if h2 != max_height:
            result2 = cv2.resize(result2, (int(w2 * max_height / h2), max_height))

        combined = np.hstack([result1, result2])

        message = f"Similarity: {similarity:.3f} ({'Same person' if is_same else 'Different persons'})"

        return combined, message, similarity, is_same

    except Exception as e:
        logger.error(f"Error in face verification: {e}")
        return None, f"Face verification error: {e}", 0.0, False

def cluster_faces(images_data):
    """Cluster faces from multiple images"""
    try:
        face_analysis = get_face_analysis()
        all_faces = []
        all_embeddings = []

        for img_data in images_data:
            nparr = np.frombuffer(img_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            results = face_analysis.get(image)

            for face in results:
                if hasattr(face, 'embedding'):
                    all_faces.append({
                        'data': img_data,
                        'bbox': face.bbox.astype(int).tolist(),
                        'embedding': face.embedding
                    })
                    all_embeddings.append(face.embedding)

        if not all_embeddings:
            return [], "No faces detected"

        embeddings = np.array(all_embeddings)
        distances = cosine_distances(embeddings)

        clustering = DBSCAN(eps=0.5, min_samples=1, metric='precomputed')
        labels = clustering.fit_predict(distances)

        groups = {}
        for i, label in enumerate(labels):
            if label not in groups:
                groups[label] = []
            groups[label].append(all_faces[i])

        clustered_groups = list(groups.values())
        message = f"Detected {len(all_faces)} faces, grouped into {len(clustered_groups)} clusters"

        return clustered_groups, message

    except Exception as e:
        logger.error(f"Error in face clustering: {e}")
        return [], f"Face clustering error: {e}"

def register_student(student_id, image_data):
    """Register a student with their face embedding"""
    try:
        face_analysis = get_face_analysis()
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = face_analysis.get(image)

        if len(results) == 0:
            return False, "No face detected"

        if len(results) > 1:
            return False, "Multiple faces detected. Please use an image with only one face"

        embedding = results[0].embedding
        registered_students[student_id] = embedding
        save_registered_students()

        return True, f"Student {student_id} registered successfully"

    except Exception as e:
        logger.error(f"Error registering student: {e}")
        return False, f"Registration error: {e}"

def process_attendance(classroom_image_data):
    """Process classroom image for attendance"""
    try:
        face_analysis = get_face_analysis()
        nparr = np.frombuffer(classroom_image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = face_analysis.get(image)
        output_image = image.copy()

        present_students = []

        for i, face in enumerate(results):
            bbox = face.bbox.astype(int)
            cv2.rectangle(output_image, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)

            face_embedding = face.embedding
            matched_student = None
            max_similarity = 0

            for student_id, registered_embedding in registered_students.items():
                similarity = np.dot(face_embedding, registered_embedding) / (
                    np.linalg.norm(face_embedding) * np.linalg.norm(registered_embedding)
                )
                if similarity > max_similarity:
                    max_similarity = similarity
                    matched_student = student_id

            if matched_student and max_similarity > 0.6:
                if matched_student not in present_students:
                    present_students.append(matched_student)
                label = f"{matched_student} ({max_similarity:.3f})"
                color = (0, 255, 0)
            else:
                label = f"Unknown ({max_similarity:.3f})"
                color = (255, 0, 0)

            output_image = draw_text_on_image(output_image, label, (bbox[0], bbox[1] - 10), color=color)

        all_students = list(registered_students.keys())
        absent_students = [s for s in all_students if s not in present_students]

        return output_image, present_students, absent_students

    except Exception as e:
        logger.error(f"Error in attendance processing: {e}")
        return None, [], []

# Flask Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "computer-vision-api"})

@app.route('/api/initialize', methods=['POST'])
def initialize_model():
    """Initialize the InsightFace model"""
    try:
        get_face_analysis()
        return jsonify({"message": "Model initialized successfully"})
    except Exception as e:
        logger.error(f"Model initialization error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete-model', methods=['POST'])
def delete_model():
    """Clean up model (for memory management)"""
    global _face_analysis, model_initialized
    try:
        _face_analysis = None
        model_initialized = False
        return jsonify({"message": "Model cleaned up"})
    except Exception as e:
        logger.error(f"Model cleanup error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect', methods=['POST'])
def detect_faces():
    """Face detection endpoint"""
    try:
        if not model_initialized:
            return jsonify({"error": "Model not initialized"}), 400

        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No image selected"}), 400

        image_data = file.read()
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        processed_image, message, faces = process_image_detection(image)

        return jsonify({
            "image": image_to_base64(processed_image),
            "message": message,
            "faces": faces
        })

    except Exception as e:
        logger.error(f"Detection error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/recognize', methods=['POST'])
def recognize_faces():
    """Face recognition endpoint"""
    try:
        if not model_initialized:
            return jsonify({"error": "Model not initialized"}), 400

        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No image selected"}), 400

        image_data = file.read()
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        processed_image, message, faces = process_image_recognition(image)

        return jsonify({
            "image": image_to_base64(processed_image),
            "message": message,
            "faces": faces
        })

    except Exception as e:
        logger.error(f"Recognition error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/verify', methods=['POST'])
def verify_faces_endpoint():
    """Face verification endpoint"""
    try:
        if not model_initialized:
            return jsonify({"error": "Model not initialized"}), 400

        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({"error": "Both images required"}), 400

        file1 = request.files['image1']
        file2 = request.files['image2']

        if file1.filename == '' or file2.filename == '':
            return jsonify({"error": "Both images must be selected"}), 400

        # Process image1
        image_data1 = file1.read()
        nparr1 = np.frombuffer(image_data1, np.uint8)
        image1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
        image1 = cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)

        # Process image2
        image_data2 = file2.read()
        nparr2 = np.frombuffer(image_data2, np.uint8)
        image2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)
        image2 = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)

        combined_image, message, similarity, is_same = verify_faces(image1, image2)

        if combined_image is None:
            return jsonify({"error": message}), 400

        return jsonify({
            "image1": image_to_base64(image1),
            "image2": image_to_base64(image2),
            "message": message,
            "similarity": similarity,
            "isSame": is_same
        })

    except Exception as e:
        logger.error(f"Verification error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cluster', methods=['POST'])
def cluster_faces_endpoint():
    """Face clustering endpoint"""
    try:
        if not model_initialized:
            return jsonify({"error": "Model not initialized"}), 400

        if 'images' not in request.files:
            return jsonify({"error": "No images provided"}), 400

        files = request.files.getlist('images')
        if not files or all(f.filename == '' for f in files):
            return jsonify({"error": "No valid images selected"}), 400

        images_data = []
        for file in files:
            if file.filename != '':
                images_data.append(file.read())

        if not images_data:
            return jsonify({"error": "No valid images"}), 400

        groups, message = cluster_faces(images_data)

        # Process groups for response
        processed_groups = []
        images_b64 = []

        for group in groups:
            group_images = []
            for face in group:
                nparr = np.frombuffer(face['data'], np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                bbox = face['bbox']
                cv2.rectangle(image, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
                image = draw_text_on_image(image, f"Group {len(processed_groups)+1}",
                                         (bbox[0], bbox[1] - 10), font_size=18, color=(0, 255, 0))
                group_images.append(image_to_base64(image))
            processed_groups.append({
                "count": len(group),
                "images": group_images
            })
            images_b64.extend(group_images)

        return jsonify({
            "message": message,
            "groups": processed_groups,
            "images": images_b64
        })

    except Exception as e:
        logger.error(f"Clustering error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/register-student', methods=['POST'])
def register_student_endpoint():
    """Student registration endpoint"""
    try:
        student_id = request.form.get('studentId')
        if not student_id:
            return jsonify({"error": "Student ID required"}), 400

        if 'image' not in request.files:
            return jsonify({"error": "Student image required"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No image selected"}), 400

        image_data = file.read()
        success, message = register_student(student_id, image_data)

        if success:
            return jsonify({"message": message})
        else:
            return jsonify({"error": message}), 400

    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/attendance', methods=['POST'])
def attendance_endpoint():
    """Attendance checking endpoint"""
    try:
        if not model_initialized:
            return jsonify({"error": "Model not initialized"}), 400

        if 'image' not in request.files:
            return jsonify({"error": "Classroom image required"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No image selected"}), 400

        image_data = file.read()
        processed_image, present, absent = process_attendance(image_data)

        if processed_image is None:
            return jsonify({"error": "Attendance processing failed"}), 500

        total = len(registered_students)
        rate = (len(present) / total * 100) if total > 0 else 0

        return jsonify({
            "image": image_to_base64(processed_image),
            "present": present,
            "absent": absent,
            "rate": rate
        })

    except Exception as e:
        logger.error(f"Attendance error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    run_simple('0.0.0.0', 5000, app, use_reloader=True, use_debugger=True)