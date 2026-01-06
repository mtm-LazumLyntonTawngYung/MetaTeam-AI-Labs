import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarChecker } from './grammar-checker';

describe('GrammarChecker', () => {
  let component: GrammarChecker;
  let fixture: ComponentFixture<GrammarChecker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarChecker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarChecker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
