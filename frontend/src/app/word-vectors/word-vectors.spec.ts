import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordVectors } from './word-vectors';

describe('WordVectors', () => {
  let component: WordVectors;
  let fixture: ComponentFixture<WordVectors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordVectors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordVectors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
