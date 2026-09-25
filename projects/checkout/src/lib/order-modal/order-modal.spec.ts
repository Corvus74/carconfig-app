import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderModal } from './order-modal';
import { TranslocoService } from '@jsverse/transloco';

describe('OrderModal', () => {
  let component: OrderModal;
  let fixture: ComponentFixture<OrderModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderModal],
      providers: [{ provide: TranslocoService, useValue: { translate: (key: string) => key } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
