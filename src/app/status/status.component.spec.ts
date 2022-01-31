import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule, CountdownEvent } from 'ngx-countdown';
import { NgChartsModule } from 'ng2-charts';

import { MessageService } from '../services/message.service'
import { StatusComponent } from './status.component';
import { GameStat } from '../board/board.component';


describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;
  let mockService: MessageService;
  
  beforeEach(async () => {        
    localStorage.clear(); // ensure storage is cleared before testin
    await TestBed.configureTestingModule({
      declarations: [ StatusComponent ],
      providers: [ NgbActiveModal,
        { provider: MessageService, useValue: jasmine.createSpyObj<MessageService>('MessageService', ['newGame']) }
      ],
      imports: [HttpClientTestingModule, CountdownModule, NgChartsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockService = TestBed.get(MessageService);
  });

  it('given component when localStorage has no data then should create', () => {
    const spy = spyOnProperty(window.localStorage, 'length').and.returnValue(0);

    expect(component).toBeTruthy();
    spy.calls.reset();
  });

  it('given component when localStorage has 1 set of data then should create', () => {    
    const spy = spyOnProperty(window.localStorage, 'length').and.returnValue(1);
    spyOn(window.localStorage, 'getItem').and.returnValue('{"isWin":true,"guessNumber":1,"board":[{"cards":[{"key":"D","hint":1},{"key":"I","hint":3},{"key":"G","hint":1},{"key":"G","hint":1},{"key":"E","hint":1},{"key":"R","hint":1}]},{"cards":[{"key":"D","hint":1},{"key":"A","hint":1},{"key":"G","hint":1},{"key":"G","hint":1},{"key":"E","hint":1},{"key":"R","hint":1}]},{"cards":[]},{"cards":[]},{"cards":[]},{"cards":[]}]}');
    
    expect(component).toBeTruthy();
    spy.calls.reset();
  });

  it('given valid component when chartClicked() then observe console', () => { 
    const spy = spyOnProperty(window.localStorage, 'length').and.returnValue(0);
    let event = { event: undefined, active: undefined };
    component.chartClicked(event);   
    spy.calls.reset(); 
  });


  it('given valid component when chartHovered() then observe console', () => { 
    const spy = spyOnProperty(window.localStorage, 'length').and.returnValue(0);
    let event = { event: undefined, active: undefined };
    component.chartHovered(event);    
    spy.calls.reset();
  });


  it('given valid component when countdown action is start then newGame should not be called', () => { 
    const spyProp = spyOnProperty(window.localStorage, 'length').and.returnValue(0);
    const spy = spyOn(mockService, 'newGame').and.returnValue(undefined);
    const startEvent: CountdownEvent = {action: 'start'} as CountdownEvent;    
    
    component.handleCountDownEvent(startEvent);
    expect(mockService.newGame).toHaveBeenCalledTimes(0);
    
    // reset after done
    spy.calls.reset();
    spyProp.calls.reset();
  });

  it('given valid component when countdown action is done then newGame should be called', () => { 
    const spyProp = spyOnProperty(window.localStorage, 'length').and.returnValue(0);
    const spy = spyOn(mockService, 'newGame').and.callThrough();
    const doneEvent: CountdownEvent = {action: 'done'} as CountdownEvent;
    
    component.handleCountDownEvent(doneEvent);    
    // TODO: figure out why spy doesn't work
    expect(mockService.newGame).toHaveBeenCalled();
    
    // reset after done
    spy.calls.reset();
    spyProp.calls.reset();
  });

  it('given valid component when 1st stat is a win on 3rd exists then update stat', () => {
    const spy = spyOnProperty(window.localStorage, 'length').and.returnValue(0);
    let stat1 = {isWin: true, guessNumber: 3} as GameStat;
    component.generateStats(stat1);
    let stat2 = {isWin: false, guessNumber: 6} as GameStat;
    component.generateStats(stat2);
    spy.calls.reset();
    spy.calls.reset();
  })

});
