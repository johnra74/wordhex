import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Subject } from 'rxjs';

import { KeyboardComponent } from './keyboard.component';
import { MessageService, Result } from '../services/message.service'
import { StatusComponent } from '../status/status.component';


describe('KeyboardComponent', () => {
  let component: KeyboardComponent;
  let fixture: ComponentFixture<KeyboardComponent>;
  let mockService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyboardComponent ],
      providers: [ StatusComponent,
        { provider: MessageService, 
          useValue: jasmine.createSpyObj<MessageService>('MessageService', ['validateAndMatch', 'getResult', 'getReloadKeyBoardNotification']) }
      ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    mockService = TestBed.get(MessageService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('given component when set of keys with backspace has been called then guess should be DRIVER', () => {
    component.keyboard.handleButtonClicked('D');
    component.keyboard.handleButtonClicked('R');
    component.keyboard.handleButtonClicked('I');
    component.keyboard.handleButtonClicked('B');
    component.keyboard.handleButtonClicked('{bksp}');
    component.keyboard.handleButtonClicked('V');
    component.keyboard.handleButtonClicked('E');
    component.keyboard.handleButtonClicked('R');

    expect(component.guess).toEqual('DRIVER');
  });

  it('given component when set of keys with backspace has been called then guess should be DRIVE', () => {
    component.keyboard.handleButtonClicked('D');
    component.keyboard.handleButtonClicked('R');
    component.keyboard.handleButtonClicked('I');
    component.keyboard.handleButtonClicked('V');
    component.keyboard.handleButtonClicked('E');
    component.keyboard.handleButtonClicked('R');
    component.keyboard.handleButtonClicked('{bksp}');

    expect(component.guess).toEqual('DRIVE');
  });

  it('given component when valid word DRIVER called with {check} then messageService should be called', () => {
    spyOn(mockService, 'validateAndMatch').and.returnValue(undefined);
    component.keyboard.handleButtonClicked('D');
    component.keyboard.handleButtonClicked('R');
    component.keyboard.handleButtonClicked('I');
    component.keyboard.handleButtonClicked('V');
    component.keyboard.handleButtonClicked('E');
    component.keyboard.handleButtonClicked('R');
    component.keyboard.handleButtonClicked('{check}');

    expect(component.guess).toEqual('DRIVER');    
    expect(mockService.validateAndMatch).toHaveBeenCalled();
  });

  it('given component when result is not a success and hint is empty then status modal should have been called', () => {
    const mockResultSubject = new Subject<Result>();
    const mockReloadSubject = new Subject<boolean>();
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getReloadKeyBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    
    component.ngOnInit();

    mockResultSubject.next({ isSuccess: false, isNaW: true, hints: [] } as Result);    

    expect(component.guess).toEqual('');
  })

  it('given component when result is not a success and hint has one hit then status modal should have been called', () => {
    const mockResultSubject = new Subject<Result>();
    const mockReloadSubject = new Subject<boolean>();
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getReloadKeyBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    
    component.ngOnInit();
    component.guess = 'FOOBAR';
    component.keysUsed = ['F', 'O', 'O', 'B', 'A', 'R'];

    mockResultSubject.next({ isSuccess: false, hints: [1] } as Result);    

    expect(component.keysHit.length).toEqual(1);
    expect(component.keysUsed.length).toEqual(5);
    expect(component.keysMiss.length).toEqual(0);
  })

  it('given component when result is not a success and hint has one miss then status modal should have been called', () => {
    const mockResultSubject = new Subject<Result>();
    const mockReloadSubject = new Subject<boolean>();
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getReloadKeyBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    
    component.ngOnInit();
    component.guess = 'FOOBAR';
    component.keysUsed = ['F', 'O', 'O', 'B', 'A', 'R'];

    mockResultSubject.next({ isSuccess: false, hints: [2] } as Result);    

    expect(component.keysHit.length).toEqual(0);
    expect(component.keysUsed.length).toEqual(5);
    expect(component.keysMiss.length).toEqual(1);
  })

  it('given component when all result observable throws error then log', () => {
    const mockResultSubject = new Subject<Result>();
    const mockReloadSubject = new Subject<boolean>();
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getReloadKeyBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    
    component.ngOnInit();

    mockReloadSubject.error('fi');
    mockResultSubject.error('fum');
  });

  it('given component when all result observable have completed', () => {
    const mockResultSubject = new Subject<Result>();
    const mockReloadSubject = new Subject<boolean>();
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getReloadKeyBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    
    component.ngOnInit();

    mockResultSubject.complete();
    mockReloadSubject.complete();
  });
});
