import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, timeout } from 'rxjs';

import { AppComponent } from './app.component';
import { MessageService } from './services/message.service'

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [ NgbModal,
        { provider: MessageService, 
          useValue: jasmine.createSpyObj<MessageService>('MessageService', ['isReady', 'reloadLastGame']) }
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    mockService = TestBed.get(MessageService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('given component when not ready then reload last game', () => {
    let flag:boolean = false;
    const mockSubject = new Subject<boolean>();
    const spyIsReady = spyOn(mockService, 'isReady').and.returnValue(mockSubject.asObservable());    
    const spyReload = spyOn(mockService, 'reloadLastGame').and.callFake(() => {
      flag = true;
    });

    component.ngOnInit();
    mockSubject.next(false);

    expect(flag).toEqual(true);

    spyReload.calls.reset();
    spyIsReady.calls.reset();
  });

  it('given component when ready then show empty board', () => {
    let flag:boolean = false;
    const mockSubject = new Subject<boolean>();
    const spyIsReady = spyOn(mockService, 'isReady').and.returnValue(mockSubject.asObservable());    
    const spyReload = spyOn(mockService, 'reloadLastGame').and.callFake(() => {
      flag = true;
    });

    component.ngOnInit();
    mockSubject.next(true);

    setTimeout(() => {
      expect(flag).toEqual(true);
    }, 1000);   
    
    spyReload.calls.reset();
    spyIsReady.calls.reset();
  });

  it('given component when showAboutDialog is called then show about', () => {
    component.showAboutDialog();
  });


});
