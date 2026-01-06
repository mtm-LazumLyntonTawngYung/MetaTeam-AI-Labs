# MetaTeam AI Labs

A comprehensive monorepo for MetaTeam's AI On-the-Job Training program, featuring hands-on projects, experiments, and learning resources focused on building practical AI skills.

This repository contains a full-stack application with computer vision capabilities, web interface, and shared libraries for AI-powered tools.

## 🏗️ Project Structure

- **`backend/`**: Flask-based REST API server for computer vision tasks including face recognition, detection, and attendance tracking
- **`frontend/`**: Modern Angular web application providing user interface for AI services
- **`libs/`**: Shared libraries and utilities, including the Myanglish-Burmese translation library

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.8+ (for backend development)

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MetaTeam-AI-Labs
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000

### Manual Setup

#### Backend Setup

See [backend/README.md](backend/README.md) for detailed setup instructions.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open http://localhost:4200 in your browser

#### Libraries

- **Myanglish Translator**: See [libs/myanglish-translator-js/readme.md](libs/myanglish-translator-js/readme.md) for usage and installation

## 🎯 Features

- **Computer Vision API**: Face detection, recognition, verification, and clustering
- **Attendance System**: Student registration and automated attendance checking
- **Web Interface**: User-friendly Angular application with multiple pages
- **Translation Tools**: Myanglish-Burmese bidirectional translation
- **Docker Support**: Easy deployment with containerization

## 📚 Learning Resources

This repository serves as a practical learning platform for:
- Computer vision with InsightFace
- Full-stack web development (Angular + Flask)
- API design and RESTful services
- Containerization with Docker
- AI model deployment and management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

[Add license information here]
