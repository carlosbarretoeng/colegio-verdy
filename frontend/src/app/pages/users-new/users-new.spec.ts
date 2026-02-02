import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNew } from './users-new';

describe('UsersNew', () => {
  let component: UsersNew;
  let fixture: ComponentFixture<UsersNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
