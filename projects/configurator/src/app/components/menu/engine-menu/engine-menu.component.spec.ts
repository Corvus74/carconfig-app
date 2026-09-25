import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineMenuComponent } from './engine-menu.component';

describe('EngineMenuComponent', () => {
  let component: EngineMenuComponent;
  let fixture: ComponentFixture<EngineMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
