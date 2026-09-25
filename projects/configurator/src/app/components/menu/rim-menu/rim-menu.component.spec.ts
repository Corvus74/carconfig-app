import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RimMenuComponent } from './rim-menu.component';

describe('RimMenuComponent', () => {
  let component: RimMenuComponent;
  let fixture: ComponentFixture<RimMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RimMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RimMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
