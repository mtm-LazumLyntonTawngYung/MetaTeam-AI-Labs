import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
})
export class Contact {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitForm() {
    console.log('Form submitted:', this.formData);
    alert('Thank you! Your message has been sent.');
    this.formData = { name: '', email: '', subject: '', message: '' };
  }
}
