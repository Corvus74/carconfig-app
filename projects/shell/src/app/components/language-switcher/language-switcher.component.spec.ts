import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let activeLanguage: 'en' | 'de';
  let previousLanguage: string | null;
  let previousDocumentLanguage: string;

  beforeEach(async () => {
    previousLanguage = localStorage.getItem('carconfig:uiLanguage');
    previousDocumentLanguage = document.documentElement.lang;
    localStorage.removeItem('carconfig:uiLanguage');
    activeLanguage = 'en';
    const transloco = {
      getActiveLang: () => activeLanguage,
      setActiveLang: jasmine.createSpy('setActiveLang').and.callFake((language: 'en' | 'de') => {
        activeLanguage = language;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [{ provide: TranslocoService, useValue: transloco }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (previousLanguage === null) localStorage.removeItem('carconfig:uiLanguage');
    else localStorage.setItem('carconfig:uiLanguage', previousLanguage);
    document.documentElement.lang = previousDocumentLanguage;
  });

  it('starts in English when there is no saved language preference', () => {
    expect(activeLanguage).toBe('en');
    expect(fixture.nativeElement.querySelector('[aria-label="English"]').getAttribute('aria-pressed')).toBe('true');
  });

  it('switches to German and persists the selection', () => {
    fixture.nativeElement.querySelector('[aria-label="German"]').click();
    fixture.detectChanges();

    expect(activeLanguage).toBe('de');
    expect(localStorage.getItem('carconfig:uiLanguage')).toBe('de');
    expect(document.documentElement.lang).toBe('de');
    expect(fixture.nativeElement.querySelector('[aria-label="German"]').getAttribute('aria-pressed')).toBe('true');
  });
});
