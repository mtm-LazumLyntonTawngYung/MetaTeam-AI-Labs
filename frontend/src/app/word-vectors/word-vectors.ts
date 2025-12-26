import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface EmbeddingResult {
  word: string;
  vector: number[];
  subwords?: { ngram: string; vector: number[] }[];
}

interface SimilarityResult {
  score: number;
}

interface SimilarWord {
  word: string;
  score: number;
}

@Component({
  selector: 'app-word-vectors',
  imports: [FormsModule, CommonModule],
  templateUrl: './word-vectors.html',
  styleUrl: './word-vectors.css',
})
export class WordVectors {
  selectedOperation: string = 'embeddings';
  inputWord: string = '';
  word1: string = '';
  word2: string = '';
  targetWord: string = '';
  isProcessing: boolean = false;
  embeddingResults: EmbeddingResult[] = [];
  similarityResult: SimilarityResult | null = null;
  similarWords: SimilarWord[] = [];

  generateEmbeddings() {
    if (!this.inputWord.trim()) return;

    this.isProcessing = true;
    this.embeddingResults = [];
    this.similarityResult = null;
    this.similarWords = [];

    // Simulate API call delay
    setTimeout(() => {
      this.processWord(this.inputWord);
      this.isProcessing = false;
    }, 2000);
  }

  calculateSimilarity() {
    if (!this.word1.trim() || !this.word2.trim()) return;

    this.isProcessing = true;
    this.embeddingResults = [];
    this.similarityResult = null;
    this.similarWords = [];

    // Simulate API call delay
    setTimeout(() => {
      const vec1 = this.generateRandomVector(300);
      const vec2 = this.generateRandomVector(300);
      this.similarityResult = { score: this.cosineSimilarity(vec1, vec2) };
      this.isProcessing = false;
    }, 2000);
  }

  findSimilarWords() {
    if (!this.targetWord.trim()) return;

    this.isProcessing = true;
    this.embeddingResults = [];
    this.similarityResult = null;
    this.similarWords = [];

    // Simulate API call delay
    setTimeout(() => {
      // Generate placeholder similar words
      const sampleWords = ['happy', 'joyful', 'cheerful', 'glad', 'pleased', 'content', 'delighted', 'ecstatic'];
      this.similarWords = sampleWords.map(word => ({
        word: word,
        score: Math.random() * 0.5 + 0.5 // Random score between 0.5 and 1
      })).sort((a, b) => b.score - a.score);
      this.isProcessing = false;
    }, 2000);
  }

  private processWord(word: string) {
    // Generate placeholder embedding with subwords
    const vector = this.generateRandomVector(300);
    const subwords = this.generateSubwords(word).map(ngram => ({
      ngram: ngram,
      vector: this.generateRandomVector(300)
    }));

    this.embeddingResults = [{
      word: word,
      vector: vector,
      subwords: subwords
    }];
  }

  private generateSubwords(word: string): string[] {
    const subwords: string[] = [];
    const n = 3; // trigram
    for (let i = 0; i <= word.length - n; i++) {
      subwords.push(word.slice(i, i + n));
    }
    // Add boundary markers
    subwords.push('<' + word.slice(0, n));
    subwords.push(word.slice(-n) + '>');
    return subwords;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < vec1.length; i++) {
      dot += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    return dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
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
