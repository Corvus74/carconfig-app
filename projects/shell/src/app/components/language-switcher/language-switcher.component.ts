import { Component, HostBinding, inject, Input } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="language-switcher" role="group" aria-label="Choose language">
      <button type="button" class="language-button" [class.active]="transloco.getActiveLang() === 'en'"
        [attr.aria-pressed]="transloco.getActiveLang() === 'en'" aria-label="English" title="English"
        (click)="changeLanguage('en')">🇬🇧</button>
      <button type="button" class="language-button" [class.active]="transloco.getActiveLang() === 'de'"
        [attr.aria-pressed]="transloco.getActiveLang() === 'de'" aria-label="German" title="German"
        (click)="changeLanguage('de')">🇩🇪</button>
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
    .language-switcher { display: flex; gap: .35rem; }
    .language-button { width: 2.25rem; height: 2.1rem; padding: 0; border: 1px solid rgba(255,255,255,.38); border-radius: .55rem; background: rgba(255,255,255,.1); font-size: 1.15rem; line-height: 1; }
    .language-button.active { background: rgba(255,255,255,.28); border-color: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,.45); }
    :host(.light) .language-button { color: #17324d; border-color: #b7c7d8; background: #fff; }
    :host(.light) .language-button.active { border-color: #145da0; background: #eaf2f9; box-shadow: 0 0 0 1px rgba(20,93,160,.22); }
  `],
})
export class LanguageSwitcherComponent {
  readonly transloco = inject(TranslocoService);
  @Input() light = false;

  @HostBinding('class.light') get lightTheme(): boolean {
    return this.light;
  }

  constructor() {
    const savedLanguage = localStorage.getItem('carconfig:uiLanguage');
    if (savedLanguage === 'de' || savedLanguage === 'en') {
      this.transloco.setActiveLang(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }

  changeLanguage(language: 'de' | 'en'): void {
    if (language === 'de' || language === 'en') {
      localStorage.setItem('carconfig:uiLanguage', language);
      this.transloco.setActiveLang(language);
      document.documentElement.lang = language;
    }
  }
}
