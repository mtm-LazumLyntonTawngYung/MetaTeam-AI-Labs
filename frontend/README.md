# MetaTeam AI Labs Frontend

A modern Angular web application providing a user interface for AI-powered services, including computer vision and language translation tools.

This application serves as the frontend for the MetaTeam AI Labs project, offering an intuitive web interface to interact with backend AI APIs.

## 🚀 Features

### Pages
- **Homepage**: Welcome page with overview of services
- **Services**: Showcase of available AI services
- **Computer Vision**: Interface for face detection, recognition, and attendance features
- **Myanglish Translator**: Tool for translating between Myanglish and Burmese
- **Careers**: Information about career opportunities
- **Contact**: Contact form and information

### Components
- **Header**: Navigation bar with routing
- **Footer**: Site footer with links and information

## 🛠️ Technology Stack

- **Framework**: Angular 20.3.7
- **Language**: TypeScript
- **Styling**: CSS
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Getting Started

### Option 1: Manual Development Setup

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

4. Open your browser and navigate to `http://localhost:4200`

The application will automatically reload when you make changes to the source files.

### Option 2: Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t ai-labs-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 4200:80 ai-labs-frontend
   ```

## 🏗️ Building for Production

To build the project for production:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

### Unit Tests

Run unit tests with Karma:

```bash
ng test
```

### End-to-End Tests

Run e2e tests:

```bash
ng e2e
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   └── pages/          # Feature pages
│   │   └── layout/
│   │       └── components/     # Layout components (header, footer)
│   ├── assets/                 # Static assets
│   └── styles.css              # Global styles
├── angular.json                # Angular CLI config
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript config
```

## 🔧 Development Commands

### Code Scaffolding

Generate new components:
```bash
ng generate component component-name
```

Generate services, guards, etc.:
```bash
ng generate service service-name
```

### Linting

Run linting:
```bash
ng lint
```

## 🌐 API Integration

This frontend application is designed to work with the backend API running on `http://localhost:5000`. Ensure the backend is running for full functionality, especially for computer vision features.

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
