import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousGoals } from './previous-goals';

describe('PreviousGoals', () => {
  let component: PreviousGoals;
  let fixture: ComponentFixture<PreviousGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousGoals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousGoals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
