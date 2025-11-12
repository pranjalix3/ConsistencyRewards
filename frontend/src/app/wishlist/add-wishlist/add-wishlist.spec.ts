import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWishlist } from './add-wishlist';

describe('AddWishlist', () => {
  let component: AddWishlist;
  let fixture: ComponentFixture<AddWishlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWishlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWishlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
