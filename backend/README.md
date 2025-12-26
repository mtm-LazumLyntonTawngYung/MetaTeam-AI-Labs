# Computer Vision Backend API

Flask-based REST API for computer vision tasks using InsightFace.

## Features

- Face Detection
- Face Recognition with Age/Gender Estimation
- Face Verification (Compare two faces)
- Face Clustering
- Student Registration for Attendance
- Attendance Checking

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if the service is running

### Model Management
- `POST /api/initialize` - Initialize the InsightFace model
- `POST /api/delete-model` - Clean up the model from memory

### Face Analysis
- `POST /api/detect` - Detect faces in an image
- `POST /api/recognize` - Recognize faces with attributes
- `POST /api/verify` - Compare two faces for similarity
- `POST /api/cluster` - Group faces from multiple images

### Attendance System
- `POST /api/register-student` - Register a student with their face
- `POST /api/attendance` - Check attendance from classroom photo

## Usage

All endpoints expect multipart/form-data for file uploads.

Example with curl:

```bash
# Initialize model
curl -X POST http://localhost:5000/api/initialize

# Detect faces
curl -X POST -F "image=@face.jpg" http://localhost:5000/api/detect
```

## Requirements

- Python 3.8+
- InsightFace models (automatically downloaded)
- OpenCV
- Flask with CORS support

## Notes

- The buffalo_l model is used for best accuracy
- Face embeddings are 512-dimensional
- Similarity threshold for verification is 0.6
- Student data is persisted in `registered_students.json`