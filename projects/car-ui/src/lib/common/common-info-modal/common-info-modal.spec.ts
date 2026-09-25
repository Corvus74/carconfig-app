import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonInfoModal } from './common-info-modal';
import { TranslocoService } from '@jsverse/transloco';

describe('CommonInfoModal', () => {
  let component: CommonInfoModal;
  let fixture: ComponentFixture<CommonInfoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonInfoModal],
      providers: [{ provide: TranslocoService, useValue: { translate: (key: string) => key } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
