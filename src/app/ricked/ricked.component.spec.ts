import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RickedComponent } from './ricked.component';

describe('RickedComponent', () => {
  let component: RickedComponent;
  let fixture: ComponentFixture<RickedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RickedComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RickedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
