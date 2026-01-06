import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-computer-vision',
  imports: [CommonModule, FormsModule],
  templateUrl: './computer-vision.html',
  styleUrl: './computer-vision.css',
})
export class ComputerVision implements OnInit, OnDestroy {
  activeTab: string = 'detection';
  modelInitialized: boolean = false;
  isInitializing: boolean = false;
  initializationProgress: number = 0;

  // File upload states
  detectionFile: File | null = null;
  recognitionFile: File | null = null;
  verificationFile1: File | null = null;
  verificationFile2: File | null = null;
  clusteringFiles: File[] = [];
  studentFile: File | null = null;
  classroomFile: File | null = null;

  // Preview URLs
  detectionPreview: string | null = null;
  recognitionPreview: string | null = null;
  verificationPreview1: string | null = null;
  verificationPreview2: string | null = null;
  clusteringPreviews: string[] = [];
  studentPreview: string | null = null;
  classroomPreview: string | null = null;

  // Processing states
  isProcessing: { [key: string]: boolean } = {};

  // Results
  detectionResult: { image: string; message: string; faces: any[] } | null = null;
  recognitionResult: { image: string; message: string; faces: any[] } | null = null;
  verificationResult: { image1: string; image2: string; message: string; similarity: number; isSame: boolean } | null = null;
  clusteringResult: { groups: any[]; message: string; images: string[] } | null = null;
  attendanceResult: { image: string; present: string[]; absent: string[]; rate: number } | null = null;

  // Student registration
  studentId: string = '';
  registeredStudents: string[] = ['student001', 'student002', 'student003']; // Initial mock data

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('offline', this.onOffline.bind(this));
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('offline', this.onOffline.bind(this));
    }
  }

  onOffline() {
    this.http.post('http://localhost:5000/api/delete-model', {}).subscribe({
      next: () => {
        this.modelInitialized = false;
      },
      error: () => {
        // Handle error if needed
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  async initializeModel() {
    if (this.modelInitialized) return;

    console.log('Initializing model...');
    this.isInitializing = true;
    this.initializationProgress = 0;

    // Simulate progress while initializing
    const progressInterval = setInterval(() => {
      if (this.initializationProgress < 90) {
        this.initializationProgress += 10;
      }
    }, 200);

    try {
      const response = await this.http.post('http://localhost:5000/api/initialize', {}).toPromise();
      console.log('Model initialized successfully:', response);
      this.initializationProgress = 100;
      this.modelInitialized = true;
      alert('Model initialized successfully!');
    } catch (error: any) {
      console.log('Error initializing model:', error);
      alert('Error initializing model: ' + (error.error?.error || error.message));
    } finally {
      clearInterval(progressInterval);
      this.isInitializing = false;
    }
  }

  onFileSelected(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (!file) return;

    switch (type) {
      case 'detection':
        this.detectionFile = file;
        this.detectionPreview = URL.createObjectURL(file);
        break;
      case 'recognition':
        this.recognitionFile = file;
        this.recognitionPreview = URL.createObjectURL(file);
        break;
      case 'verification1':
        this.verificationFile1 = file;
        this.verificationPreview1 = URL.createObjectURL(file);
        break;
      case 'verification2':
        this.verificationFile2 = file;
        this.verificationPreview2 = URL.createObjectURL(file);
        break;
      case 'clustering':
        if (event.target.files && event.target.files.length > 1) {
          // Multiple files selected
          this.clusteringFiles = [];
          this.clusteringPreviews = [];
          for (let i = 0; i < event.target.files.length; i++) {
            const f = event.target.files[i];
            this.clusteringFiles.push(f);
            this.clusteringPreviews.push(URL.createObjectURL(f));
          }
        } else {
          // Single file, but shouldn't happen since multiple
          if (index !== undefined) {
            this.clusteringFiles[index] = file;
            this.clusteringPreviews[index] = URL.createObjectURL(file);
          } else {
            this.clusteringFiles.push(file);
            this.clusteringPreviews.push(URL.createObjectURL(file));
          }
        }
        break;
      case 'student':
        this.studentFile = file;
        this.studentPreview = URL.createObjectURL(file);
        break;
      case 'classroom':
        this.classroomFile = file;
        this.classroomPreview = URL.createObjectURL(file);
        break;
    }
  }

  addClusteringFile() {
    this.clusteringFiles.push(null as any);
    this.clusteringPreviews.push(null as any);
  }

  removeClusteringFile(index: number) {
    this.clusteringFiles.splice(index, 1);
    this.clusteringPreviews.splice(index, 1);
  }

  async processDetection() {
    if (!this.modelInitialized) {
      alert('Please initialize the model first!');
      return;
    }
    if (!this.detectionFile) {
      alert('Please select an image!');
      return;
    }

    console.log('Starting detection process...');
    this.isProcessing['detection'] = true;

    const formData = new FormData();
    formData.append('image', this.detectionFile);

    this.http.post('http://localhost:5000/api/detect', formData).subscribe({
      next: (response: any) => {
        console.log('Detection result:', response);
        this.detectionResult = {
          image: response.image,
          message: response.message,
          faces: response.faces
        };
        console.log('Detection result set:', this.detectionResult);
        console.log('Image data length:', this.detectionResult.image.length);
        console.log('Image starts with:', this.detectionResult.image.substring(0, 50));
        this.isProcessing['detection'] = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Detection error:', error);
        alert('Error processing image: ' + (error.error?.error || error.message));
        this.isProcessing['detection'] = false;
        this.cdr.detectChanges();
      }
    });
  }

  async processRecognition() {
    if (!this.modelInitialized) {
      alert('Please initialize the model first!');
      return;
    }
    if (!this.recognitionFile) {
      alert('Please select an image!');
      return;
    }

    console.log('Starting recognition process...');
    this.isProcessing['recognition'] = true;

    const formData = new FormData();
    formData.append('image', this.recognitionFile);

    this.http.post('http://localhost:5000/api/recognize', formData).subscribe({
      next: (response: any) => {
        console.log('Recognition result:', response);
        this.recognitionResult = {
          image: response.image,
          message: response.message,
          faces: response.faces
        };
        console.log('Recognition result set:', this.recognitionResult);
        this.isProcessing['recognition'] = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Recognition error:', error);
        alert('Error processing image: ' + (error.error?.error || error.message));
        this.isProcessing['recognition'] = false;
        this.cdr.detectChanges();
      }
    });
  }

  async processVerification() {
    if (!this.modelInitialized) {
      alert('Please initialize the model first!');
      return;
    }
    if (!this.verificationFile1 || !this.verificationFile2) {
      alert('Please select both images!');
      return;
    }

    console.log('Starting verification process...');
    this.isProcessing['verification'] = true;

    const formData = new FormData();
    formData.append('image1', this.verificationFile1);
    formData.append('image2', this.verificationFile2);

    this.http.post('http://localhost:5000/api/verify', formData).subscribe({
      next: (response: any) => {
        console.log('Verification result:', response);
        this.verificationResult = {
          image1: response.image1,
          image2: response.image2,
          message: response.message,
          similarity: response.similarity,
          isSame: response.isSame
        };
        console.log('Verification result set:', this.verificationResult);
        this.isProcessing['verification'] = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Verification error:', error);
        alert('Error processing images: ' + (error.error?.error || error.message));
        this.isProcessing['verification'] = false;
        this.cdr.detectChanges();
      }
    });
  }

  async processClustering() {
    if (!this.modelInitialized) {
      alert('Please initialize the model first!');
      return;
    }
    if (this.clusteringFiles.length === 0) {
      alert('Please select images!');
      return;
    }

    console.log('Starting clustering process...');
    this.isProcessing['clustering'] = true;

    const formData = new FormData();
    this.clusteringFiles.forEach(file => {
      if (file) formData.append('images', file);
    });

    this.http.post('http://localhost:5000/api/cluster', formData).subscribe({
      next: (response: any) => {
        console.log('Clustering result:', response);
        this.clusteringResult = {
          message: response.message,
          groups: response.groups.map((group: any) => ({
            count: group.count,
            images: group.indices.map((i: number) => response.images[i])
          })),
          images: response.images
        };
        console.log('Clustering result set:', this.clusteringResult);
        this.isProcessing['clustering'] = false;
      },
      error: (error) => {
        console.log('Clustering error:', error);
        alert('Error processing images: ' + (error.error?.error || error.message));
        this.isProcessing['clustering'] = false;
      }
    });
  }

  async registerStudent() {
    if (!this.studentId.trim()) {
      alert('Please enter student ID!');
      return;
    }
    if (!this.studentFile) {
      alert('Please select student image!');
      return;
    }

    console.log('Starting student registration...');
    const formData = new FormData();
    formData.append('studentId', this.studentId);
    formData.append('image', this.studentFile);

    this.http.post('http://localhost:5000/api/register-student', formData).subscribe({
      next: (response: any) => {
        console.log('Student registration result:', response);
        if (!this.registeredStudents.includes(this.studentId)) {
          this.registeredStudents.push(this.studentId);
        }
        alert(response.message);
        this.studentId = '';
        this.studentFile = null;
      },
      error: (error) => {
        console.log('Student registration error:', error);
        alert('Error registering student: ' + (error.error?.error || error.message));
      }
    });
  }

  async processAttendance() {
    if (!this.modelInitialized) {
      alert('Please initialize the model first!');
      return;
    }
    if (!this.classroomFile) {
      alert('Please select classroom image!');
      return;
    }
    if (this.registeredStudents.length === 0) {
      alert('No registered students!');
      return;
    }

    console.log('Starting attendance process...');
    this.isProcessing['attendance'] = true;

    const formData = new FormData();
    formData.append('image', this.classroomFile);

    this.http.post('http://localhost:5000/api/attendance', formData).subscribe({
      next: (response: any) => {
        console.log('Attendance result:', response);
        this.attendanceResult = {
          image: response.image,
          present: response.present,
          absent: response.absent,
          rate: response.rate
        };
        console.log('Attendance result set:', this.attendanceResult);
        this.isProcessing['attendance'] = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Attendance error:', error);
        alert('Error checking attendance: ' + (error.error?.error || error.message));
        this.isProcessing['attendance'] = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadResult(type: string) {
    // Mock download - in real app would download processed image
    alert(`${type} result downloaded!`);
  }

  clearResults() {
    this.detectionResult = null;
    this.recognitionResult = null;
    this.verificationResult = null;
    this.clusteringResult = null;
    this.attendanceResult = null;
  }
}
