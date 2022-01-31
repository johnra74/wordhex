import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Subject } from 'rxjs';

import { BoardComponent, Row, Card } from './board.component';
import { MessageService, Result } from '../services/message.service'

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockService: any;

  beforeEach(async () => {
    localStorage.clear(); // ensure storage is cleared before testin

    await TestBed.configureTestingModule({
      declarations: [ BoardComponent ],
      providers: [
        { provider: MessageService, 
          useValue: jasmine.createSpyObj<MessageService>('MessageService', ['getKey', 'getResult', 'getReloadBoardNotification', 'getCurrentDateKey']) }
      ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    mockService = TestBed.get(MessageService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('given component when {bksp} and "X" keys are sent then board should pop last chracter then add', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<Result>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());

    component.board = [] as Row[]; 
    component.board.push({cards: []} as Row);
    component.board[0].cards.push({} as Card);

    component.ngOnInit();

    mockKeySubject.next('{bksp}');
    expect(component.board[0].cards.length).toEqual(0);
    mockKeySubject.next('X');
    expect(component.board[0].cards.length).toEqual(1);
    expect(component.board[0].cards[0].hint).toEqual(3);
    expect(component.board[0].cards[0].key).toEqual('X');
  })

  it('given component when guess are exhausted then result should be saved to storage', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<boolean>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getCurrentDateKey').and.returnValue('20220130');

    component.rowNumber = 6;
    spyOn(window.localStorage, 'setItem').and.callFake((key, value) => { 
      expect(key).toEqual('20220130')      
    });

    component.ngOnInit();
    mockResultSubject.next({} as Result);

  })

  it('given component when guess is wrong and number of tries are not exhausted then card to reveal hints', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<boolean>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getCurrentDateKey').and.returnValue('20220130');

    component.rowNumber = 0;
    component.board = [] as Row[]; 
    component.board.push({cards: []} as Row);
    component.board[0].cards.push({key: 'D'} as Card);
    component.board[0].cards.push({key: 'R'} as Card);
    component.board[0].cards.push({key: 'I'} as Card);
    component.board[0].cards.push({key: 'V'} as Card);
    component.board[0].cards.push({key: 'E'} as Card);
    component.board[0].cards.push({key: 'R'} as Card);

    component.ngOnInit();
    mockResultSubject.next({isSuccess: false, hints: [1, 1, 1, 1, 3, 1]} as Result);
    expect(component.rowNumber).toEqual(1);

  })

  it('given component when guess is correct then result should be saved to storage', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<boolean>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getCurrentDateKey').and.returnValue('20220130');
    spyOn(window.localStorage, 'setItem').and.callFake((key, value) => { 
      expect(key).toEqual('20220130')      
    });

    component.rowNumber = 0;
    component.board = [] as Row[]; 
    component.board.push({cards: []} as Row);
    component.board[0].cards.push({key: 'D'} as Card);
    component.board[0].cards.push({key: 'R'} as Card);
    component.board[0].cards.push({key: 'I'} as Card);
    component.board[0].cards.push({key: 'V'} as Card);
    component.board[0].cards.push({key: 'E'} as Card);
    component.board[0].cards.push({key: 'R'} as Card);

    component.ngOnInit();
    mockResultSubject.next({isSuccess: true, hints: [1, 1, 1, 1, 1, 1]} as Result);
    expect(component.rowNumber).toEqual(1);

  })

  it('given component when reloaded event occurs then board is reloaded', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<boolean>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    spyOn(mockService, 'getCurrentDateKey').and.returnValue('20220130');
    spyOn(window.localStorage, 'getItem').and.returnValue('{"isWin":true,"guessNumber":1,"board":[{"cards":[{"key":"D","hint":1},{"key":"I","hint":3},{"key":"G","hint":1},{"key":"G","hint":1},{"key":"E","hint":1},{"key":"R","hint":1}]},{"cards":[{"key":"D","hint":1},{"key":"A","hint":1},{"key":"G","hint":1},{"key":"G","hint":1},{"key":"E","hint":1},{"key":"R","hint":1}]},{"cards":[]},{"cards":[]},{"cards":[]},{"cards":[]}]}');

    component.ngOnInit();
    mockReloadSubject.next(true);

    // need to wait to give time to load from mockstorage
    setTimeout(()=>{
      expect(component.rowNumber).toEqual(0);
    },1000);    
  });

  it('given component when all key observable throws error then log', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<boolean>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    
    component.ngOnInit();
    const spy = spyOn(console, 'log');
    mockKeySubject.error('fe');
    mockReloadSubject.error('fi');
    mockResultSubject.error('fum');
    
  });

  it('given component when all key observable have completed', () => {
    const mockKeySubject = new Subject<string>();
    const mockReloadSubject = new Subject<boolean>();
    const mockResultSubject = new Subject<Result>();

    spyOn(mockService, 'getKey').and.returnValue(mockKeySubject.asObservable());
    spyOn(mockService, 'getReloadBoardNotification').and.returnValue(mockReloadSubject.asObservable());
    spyOn(mockService, 'getResult').and.returnValue(mockResultSubject.asObservable());
    
    component.ngOnInit();    
    mockKeySubject.complete();
    mockReloadSubject.complete();
    mockResultSubject.complete();
    
  });
});
