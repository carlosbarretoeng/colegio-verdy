import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPageList } from './crud-page-list';

describe('CrudPageList', () => {
  let component: CrudPageList;
  let fixture: ComponentFixture<CrudPageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudPageList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudPageList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
