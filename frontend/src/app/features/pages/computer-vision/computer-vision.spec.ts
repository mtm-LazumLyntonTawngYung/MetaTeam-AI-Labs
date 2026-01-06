import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerVision } from './computer-vision';

describe('ComputerVision', () => {
  let component: ComputerVision;
  let fixture: ComponentFixture<ComputerVision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputerVision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputerVision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
