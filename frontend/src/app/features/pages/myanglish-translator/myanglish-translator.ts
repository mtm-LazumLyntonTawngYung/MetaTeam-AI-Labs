import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
  code: string;
  name: string;
  flag: string; // emoji or svg
}

@Component({
  selector: 'app-myanglish-translator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myanglish-translator.html',
  styleUrls: ['./myanglish-translator.css'],
})
export class MyanglishTranslator {
  // Available languages (only two)
  languages: Language[] = [
    { code: 'my', name: 'Myanglish', flag: '🇲E' },
    { code: 'bm', name: 'Burmese', flag: '🇲🇲' },
  ];

  // Default selections
  sourceLanguage: Language = this.languages[0]; // Myanglish
  targetLanguage: Language = this.languages[1]; // Burmese

  sourceText: string = '';
  translatedText: string = '';

  // Swap source and target languages and text
  swapLanguages(): void {
    [this.sourceLanguage, this.targetLanguage] = [this.targetLanguage, this.sourceLanguage];
    [this.sourceText, this.translatedText] = [this.translatedText, this.sourceText];
  }

  // Translate method (replace with actual API call)
  translate(): void {
    this.translatedText = `${this.sourceText} [Translated to ${this.targetLanguage.name}]`;
  }
}
