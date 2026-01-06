import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isMenuOpen = false;
  isLangOpen = false;

  languages = [
    {
      code: 'en',
      name: 'English',
      svg: `<svg class="w-5 h-5" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#b22234" d="M0 0h640v53.33H0zm0 106.66h640v53.34H0zm0 106.66h640v53.33H0zm0 106.66h640v53.34H0zm0 106.66h640v53.33H0z"/><path fill="#3c3b6e" d="M0 0h288v213.33H0z"/><g fill="#fff"><g id="s"><g id="s1"><g id="s2"><g id="s3"><g id="s4"><g id="s5"><g id="s6"><g id="s7"><g id="s8"><g id="s9"><g id="s10"><g id="s11"><g id="s12"><g id="s13"><g id="s14"><g id="s15"><path d="M30 15l3.09 9.51h9.82l-7.95 5.78 3.09 9.51-7.95-5.78-7.95 5.78 3.09-9.51-7.95-5.78h9.82z"/></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></g></svg>`,
    },
    {
      code: 'my',
      name: 'Burmese',
      svg: `<svg class="w-5 h-5" viewBox="0 0 640 480"><path fill="#f00" d="M0 0h640v480H0z"/><path fill="#ff0" d="M0 160h640v160H0z"/><path fill="#00f" d="M0 320h640v160H0z"/></svg>`,
    },
    {
      code: 'jp',
      name: 'Japanese',
      svg: `<svg class="w-5 h-5" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><circle fill="#bc002d" cx="320" cy="240" r="96"/></svg>`,
    },
  ];

  selectedLang = this.languages[0];

  constructor(private sanitizer: DomSanitizer, private translate: TranslateService) {}

  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  selectLanguage(lang: any): void {
    this.selectedLang = lang;
    this.isLangOpen = false;
    this.translate.use(lang.code);
  }
}
