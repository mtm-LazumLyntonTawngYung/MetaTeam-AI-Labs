import { Routes } from '@angular/router';
import { Homepage } from './features/pages/homepage/homepage';
import { Services } from './features/pages/services/services';
import { Careers } from './features/pages/careers/careers';
import { Contact } from './features/pages/contact/contact';
import { MyanglishTranslator } from './features/pages/myanglish-translator/myanglish-translator';
import { ComputerVision } from './features/pages/computer-vision/computer-vision';
import { WordVectors } from './word-vectors/word-vectors';
import { GrammarChecker } from './grammar-checker/grammar-checker';

export const routes: Routes = [
  {
    path: '',
    component: Homepage
  },
  {
    path: 'services',
    component: Services
  },
  {
    path: 'careers',
    component: Careers
  },
  {
    path: 'contact',
    component: Contact
  },
  {
    path: 'myanglish-translator',
    component: MyanglishTranslator
  },
  {
    path: 'computer-vision',
    component: ComputerVision
  },
  {
    path: 'word-vectors',
    component: WordVectors
  },
  {
    path: 'grammar-checker',
    component: GrammarChecker
  }
]