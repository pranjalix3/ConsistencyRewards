import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationPopup } from './celebration-popup';

describe('CelebrationPopup', () => {
  let component: CelebrationPopup;
  let fixture: ComponentFixture<CelebrationPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelebrationPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelebrationPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
