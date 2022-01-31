import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  let store:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);

    store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('given valid service and init() is called when game has played then return true on Observable<boolean>', () => {    
    
    store['20220129'] = "{}";

    service.isReady().subscribe((flag:boolean) => {
      expect(flag).toBe(true);
    });

    service.init();
    
  });

  it('given valid service and init() is called when game has not played then return false on Observable<boolean>', () => {    
    
    service.isReady().subscribe((flag:boolean) => {
      expect(flag).toBe(false);
    });

    service.init();
  });

  it('given valid service when reloadLastGame() is called then return true on Observable<boolean> for reloadBoardSubject & reloadKeyBoardSubject', () => {    
    service.getReloadBoardNotification().subscribe((flag:boolean) => {
      expect(flag).toBe(true);
    });
    service.getReloadKeyBoardNotification().subscribe((flag:boolean) => {
      expect(flag).toBe(true);
    });

    service.reloadLastGame();    
  });

  it('given valid service when sendKey() is called then return sent key on Observable<string>', () => {    
    service.getKey().subscribe((key:string) => {
      expect(key).toBe('G');
    });

    service.sendKey('G');
  });

  it('given valid service when newGame() is called then confirm setTimer was called', () => {
    spyOn(window, 'setTimeout');
    service.newGame();
    expect(setTimeout).toHaveBeenCalled();
  });

});
