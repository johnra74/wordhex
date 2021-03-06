import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { GameStat } from '../board/board.component';

interface Game {
  id: string;
  seed: string;
}

export interface Result {
  isSuccess: boolean;
  isNaW: boolean;
  hints: number[];
}

export interface Easter {
  type: string,
  action: string
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private enterKeySubject = new Subject<string>();
  private validAndMatchSubject = new Subject<Result>();
  private isReadySubject = new Subject<boolean>();
  
  private reloadBoardSubject = new Subject<boolean>();
  private reloadKeyBoardSubject = new Subject<boolean>();

  private easterEggSubject = new Subject<string>();
  
  private gameEngine: Worker;
  private isGameOver: boolean;
  
  constructor(private http: HttpClient) {  
    this.isGameOver = false;
  }

  init(): void {
    if (typeof Worker !== 'undefined') {
      this.gameEngine = 
        new Worker(new URL('../worker/engine.worker', import.meta.url),
                   { type: 'module' });
      this.gameEngine.onmessage = (event) => {
        if (typeof event.data === 'object' && typeof event.data['type'] === 'undefined' ) {
          this.validAndMatchSubject.next(event.data as Result);
        } else {
          this.easterEggSubject.next(event.data['action']);
        }        
      };
    }

    // check if user can play today..
    // TODO: need to add check if user is in middle of game
    if (this.canPlay()) {
      this.fetchGame();
    } else {
      this.isReadySubject.next(false);
    }
  } 

  newGame(): void {
    setTimeout(() => {
      this.fetchGame();
    }, 1000); // wait 1 seconds before generate key to fetch
  }

  sendKey(enteredKey: string) : void {
    this.enterKeySubject.next(enteredKey);
  }

  getKey(): Observable<string> {
    return this.enterKeySubject.asObservable();
  }

  isReady(): Observable<boolean> {
    return this.isReadySubject.asObservable();
  }

  isDone(): boolean {
    return this.isGameOver;
  }
  
  setDone(flag:boolean): void {
    this.isGameOver = flag;
  }

  getEasterEgg(): Observable<string> {
    return this.easterEggSubject.asObservable();
  }

  getReloadBoardNotification(): Observable<boolean> {
    return this.reloadBoardSubject.asObservable();
  }

  getReloadKeyBoardNotification(): Observable<boolean> {
    return this.reloadKeyBoardSubject.asObservable();
  }

  reloadLastGame(isDone:boolean): void {    
    this.reloadBoardSubject.next(isDone);
    this.reloadKeyBoardSubject.next(isDone);
  }

  getCurrentDateKey(): string {
    return this.generateKey(0);
  }

  generateKey(numOfDays: number): string {
    const today = new Date();
    today.setDate(today.getDate() + numOfDays);

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const key = yyyy + mm + dd;
    return key;
  }

  sendResult(result:Result): void {
    this.validAndMatchSubject.next(result);
  }

  getResult(): Observable<Result> {
    return this.validAndMatchSubject.asObservable();
  }

  validateAndMatch(guess:string): void {
    this.gameEngine.postMessage({ type: 'isValidWord', payload: guess });
  }
  
  canPlay(): boolean {    
    let playable: boolean = false;
    const item = localStorage.getItem(this.getCurrentDateKey())
    if (typeof item === 'object' && item === null) {
      playable = true;      
    } else {
      const stat: GameStat = JSON.parse(item) as GameStat;
      if (stat.inProgress) {
        this.reloadLastGame(false);
        playable = true;
      }      
    }
    return playable;
  }

  private fetchGame(): void {
    // get today's word      
    let url: string;
    if (environment.production) {
      url = '/daily-puzzle/' + this.getCurrentDateKey() + '.json';
    } else {
      url = 'assets/test.json';
    }

    this.http.get<Game>(url)
      .subscribe((data:Game) => {        
        if (data.id === this.getCurrentDateKey()) {
          this.gameEngine.postMessage({ type: 'seed', payload: atob(data.seed)});
          this.isReadySubject.next(true);
        } else {
          this.isReadySubject.next(false);
        }
      });
  }
}
