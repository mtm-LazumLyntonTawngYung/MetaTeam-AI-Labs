import { Routes } from '@angular/router';
import { Homepage } from './features/pages/homepage/homepage';
import { Services } from './features/pages/services/services';
import { Careers } from './features/pages/careers/careers';
import { Contact } from './features/pages/contact/contact';
import { MyanglishTranslator } from './features/pages/myanglish-translator/myanglish-translator';

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
  }
]