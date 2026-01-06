import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyanglishTranslator } from './myanglish-translator';

describe('MyanglishTranslator', () => {
  let component: MyanglishTranslator;
  let fixture: ComponentFixture<MyanglishTranslator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyanglishTranslator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyanglishTranslator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
