import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css'],
})
export class Careers {
  openPositions = [
    {
      title: 'Frontend Developer',
      location: 'Yangon, Myanmar',
      type: 'Full-Time',
      description: 'Develop and maintain modern web applications using Angular, React, or Vue.',
      status: 'Opened',
      applyLink: 'mailto:careers@metateam.com?subject=Frontend Developer Application',
    },
    {
      title: 'Backend Developer',
      location: 'Yangon, Myanmar',
      type: 'Full-Time',
      description: 'Design and implement APIs, work with databases, ensure scalability and security.',
      status: 'Opened',
      applyLink: 'mailto:careers@metateam.com?subject=Backend Developer Application',
    },
    {
      title: 'UI/UX Designer',
      location: 'Remote',
      type: 'Full-Time',
      description: 'Create engaging, responsive designs for web and mobile applications.',
      status: 'Expired',
      applyLink: '',
    },
    {
      title: 'QA Engineer',
      location: 'Yangon, Myanmar',
      type: 'Full-Time',
      description: 'Perform functional, integration, and automated testing to ensure product quality.',
      status: 'Opened',
      applyLink: 'mailto:careers@metateam.com?subject=QA Engineer Application',
    },
  ];
}
