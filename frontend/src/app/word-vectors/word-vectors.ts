import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface EmbeddingResult {
  word: string;
  vector: number[];
}

@Component({
  selector: 'app-word-vectors',
  imports: [FormsModule, CommonModule],
  templateUrl: './word-vectors.html',
  styleUrl: './word-vectors.css',
})
export class WordVectors {
  inputSentence: string = '';
  isProcessing: boolean = false;
  embeddingResults: EmbeddingResult[] = [];

  generateEmbeddings() {
    if (!this.inputSentence.trim()) return;

    this.isProcessing = true;
    this.embeddingResults = [];

    // Simulate API call delay
    setTimeout(() => {
      this.processSentence(this.inputSentence);
      this.isProcessing = false;
    }, 2000);
  }

  private processSentence(sentence: string) {
    // Split sentence into words (basic tokenization)
    const words = sentence.split(/\s+/).filter(word => word.length > 0);

    // Generate placeholder embeddings (random vectors for demo)
    this.embeddingResults = words.map(word => ({
      word: word,
      vector: this.generateRandomVector(300) // 300 dimensions typical for word embeddings
    }));
  }

  private generateRandomVector(dimensions: number): number[] {
    const vector: number[] = [];
    for (let i = 0; i < dimensions; i++) {
      // Generate random values between -1 and 1
      vector.push(Math.random() * 2 - 1);
    }
    return vector;
  }
}
