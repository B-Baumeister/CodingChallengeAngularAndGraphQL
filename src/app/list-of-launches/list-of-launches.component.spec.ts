import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfLaunchesComponent } from './list-of-launches.component';

describe('ListOfLaunchesComponent', () => {
  let component: ListOfLaunchesComponent;
  let fixture: ComponentFixture<ListOfLaunchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOfLaunchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfLaunchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
