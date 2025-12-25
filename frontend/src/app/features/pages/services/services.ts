import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class Services {
  services = [
    {
      title: 'Offshore Software Development',
      description: `We provide full-cycle offshore software development for Japanese and international clients.
      Our team handles design, development, testing, and QA to ensure high-quality, timely delivery.`,
      image: 'assets/images/offshore-software.jpg', // Replace with real image path
    },
    {
      title: 'Web Application Development',
      description: `Custom web apps using the latest frameworks. Our solutions are scalable, secure, and maintainable.
      We build systems for factories, hotels, travel agencies, schools, insurance, and property management.`,
      list: [
        'Factory Management System',
        'Hotel Management System',
        'Travel & Tour Management System',
        'School Management System',
        'Insurance Management System',
        'Property Management System',
      ],
      image: 'assets/images/web-app-development.jpg',
    },
    {
      title: 'Mobile Application Development',
      description: `End-to-end mobile app development for iOS and Android.
      We focus on UI/UX, performance, and seamless integration with your existing systems.`,
      image: 'assets/images/mobile-app.jpg',
    },
    {
      title: 'Website Development',
      description: `Responsive, modern websites tailored to your business goals. We follow international standards for
      speed, SEO, and cross-device compatibility.`,
      image: 'assets/images/website-development.jpg',
    },
    {
      title: 'Business Process Outsourcing (BPO)',
      description: `Data annotation, video tagging, and analytics services to help you automate insights and enhance
      your business intelligence.`,
      image: 'assets/images/bpo.jpg',
    },
  ];
}
