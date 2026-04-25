import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AboutComponent } from './about.component';
import { MessageService } from '../services/message.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let mockService: MessageService;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj<MessageService>('MessageService', ['newGame']);
    await TestBed.configureTestingModule({
    declarations: [AboutComponent],
    imports: [],
    providers: [NgbActiveModal,
        { provider: MessageService, useValue: mockService }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
