import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import translator, { ConvertMode } from '../../../../lib/myanglish-translator-js/src/index.js';

interface Language {
  code: string;
  name: string;
  flag: string; // emoji or svg
}

interface DictionaryEntry {
  word: string;
  translation: string;
}

@Component({
  selector: 'app-myanglish-translator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myanglish-translator.html',
  styleUrls: ['./myanglish-translator.css'],
})
export class MyanglishTranslator {
  // Available languages
  languages: Language[] = [
    { code: 'my', name: 'Myanglish', flag: '🇲🇲' },
    { code: 'bm', name: 'Burmese', flag: '🇲🇲' },
  ];

  // Default selections
  sourceLanguage: Language = this.languages[0];
  targetLanguage: Language = this.languages[1];

  sourceText: string = '';
  translatedText: string = '';

  // Options
  unknownKeywordMode: string = ConvertMode.LEAVE_UNKNOWN_KEYWORDS;
  ConvertMode = ConvertMode; // for template

  // Modal state
  showModal: boolean = false;
  modalWord: string = '';
  modalTranslation: string = '';
  modalAction: 'add' | 'edit' = 'add';

  // Dictionary
  dictionary: DictionaryEntry[] = [];

  // Swap source and target languages
  swapLanguages(): void {
    [this.sourceLanguage, this.targetLanguage] = [this.targetLanguage, this.sourceLanguage];
    [this.sourceText, this.translatedText] = [this.translatedText, this.sourceText];
  }

  // Detect language based on text
  detectLanguage(text: string): Language {
    const burmeseRegex = /[\u1000-\u109f]/; // Unicode range for Burmese characters
    if (burmeseRegex.test(text)) {
      return this.languages.find(l => l.code === 'bm')!;
    } else {
      return this.languages.find(l => l.code === 'my')!;
    }
  }

  // Translate text
  translate(): void {
    if (!this.sourceText.trim()) {
      this.translatedText = '';
      return;
    }

    // Auto-detect source language
    this.sourceLanguage = this.detectLanguage(this.sourceText);

    const options = { mode: this.unknownKeywordMode };
    if (this.sourceLanguage.code === 'my' && this.targetLanguage.code === 'bm') {
      this.translatedText = translator.convertToBurmese(this.sourceText, options);
    } else if (this.sourceLanguage.code === 'bm' && this.targetLanguage.code === 'my') {
      this.translatedText = translator.convertToMyanglish(this.sourceText, options);
    } else {
      this.translatedText = this.sourceText; // same language or invalid
    }
  }

  // Open Add Word modal
  addWord(): void {
    this.modalAction = 'add';
    this.modalWord = this.sourceText;
    this.modalTranslation = this.translatedText;
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.modalWord = '';
    this.modalTranslation = '';
  }

  // Save word to dictionary
  saveWord(): void {
    if (!this.modalWord.trim() || !this.modalTranslation.trim()) return;

    if (this.modalAction === 'add') {
      this.dictionary.push({
        word: this.modalWord,
        translation: this.modalTranslation,
      });
    } else if (this.modalAction === 'edit') {
      // Implement edit logic here if needed
    }

    this.closeModal();
  }

  // Optional: Edit word (future enhancement)
  editWord(entry: DictionaryEntry): void {
    this.modalAction = 'edit';
    this.modalWord = entry.word;
    this.modalTranslation = entry.translation;
    this.showModal = true;
  }
}
