import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grammar-checker',
  imports: [FormsModule, CommonModule],
  templateUrl: './grammar-checker.html',
  styleUrl: './grammar-checker.css',
})
export class GrammarChecker {
  inputText: string = '';
  isChecking: boolean = false;
  results: any = null;

  checkGrammar(): void {
    if (!this.inputText.trim()) return;

    this.isChecking = true;
    // Simulate API call
    setTimeout(() => {
      this.results = {
        score: 85,
        errors: 3,
        suggestions: 2,
        correctedText: 'This is the corrected version of your text with proper grammar and punctuation.',
        errorsList: [
          {
            type: 'Spelling Error',
            description: 'Incorrect word usage detected',
            original: 'teh',
            suggestion: 'the'
          },
          {
            type: 'Grammar Error',
            description: 'Subject-verb agreement issue',
            original: 'He go',
            suggestion: 'He goes'
          },
          {
            type: 'Punctuation Error',
            description: 'Missing comma in compound sentence',
            original: 'I went to the store and bought milk.',
            suggestion: 'I went to the store, and bought milk.'
          }
        ],
        suggestionsList: [
          {
            title: 'Improve Sentence Variety',
            description: 'Consider using a mix of simple, compound, and complex sentences to make your writing more engaging.'
          },
          {
            title: 'Use Active Voice',
            description: 'Active voice is generally more direct and engaging than passive voice.'
          }
        ]
      };
      this.isChecking = false;
    }, 2000);
  }

  downloadReport(): void {
    // Placeholder for download functionality
    console.log('Downloading report...');
  }
}
