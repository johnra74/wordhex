import { Component, OnInit } from '@angular/core';

import { MessageService, Result } from '../services/message.service'

export interface GameStat {
  isWin: boolean;
  inProgress: boolean;
  guessNumber: number;
  board: Row[];
}

export interface Card {
  key: string;
  hint: number;
}

export interface Row {
  cards: Card[]
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  rowNumber: number = 0;
  board: Row[];
  
  constructor(private messageService: MessageService) { 
    this.board = [];
    for (let idx = 0; idx < 6; idx++) {
      const row = {cards: []} as Row;
      row.cards = [] as Card[];
      this.board.push(row);
    }    
  }

  ngOnInit(): void {
    this.messageService.getKey().subscribe({
      next: (letter:string) => {
        if (letter === "{bksp}") {
          this.board[this.rowNumber].cards.pop();
        } else {
          let card:Card = { key: letter, hint: 3 } as Card;
          this.board[this.rowNumber].cards.push(card);
        }
      },
      error: (e) => console.log(e),
      complete: () => console.log('key::done')
    });

    this.messageService.getResult().subscribe({
      next: (result:Result) => {
        if (this.rowNumber === 6) {
          this.saveToLocalStorage(false, 7);     
        } else {
          for (let idx = 0; idx < 6; idx++) {          
            this.board[this.rowNumber].cards[idx].hint = result.isSuccess ? 1 : result.hints[idx];
          }          
          this.rowNumber++;
          this.saveToLocalStorage(result.isSuccess, this.rowNumber);          
        }
      },
      error: (e) => console.log(e),
      complete: () => console.log('hints::done')
    })

    this.messageService.getReloadBoardNotification().subscribe({
      next: (refresh:boolean) => {
        this.reloadLastGame();
      },
      error: (e) => console.log(e),
      complete: () => console.log('reload::done')
    });
  }

  private saveToLocalStorage(isWin:boolean, guessNumber:number): void {
    let stat:GameStat;
    if (guessNumber === 7) {
      stat = { isWin: false, inProgress: false, guessNumber: guessNumber, board: this.board };
    } else if (isWin) {
      stat = { isWin: true, inProgress: false, guessNumber: guessNumber, board: this.board };
    } else {
      stat = { inProgress: true, guessNumber: guessNumber, board: this.board } as GameStat;
    }
    localStorage.setItem(this.messageService.getCurrentDateKey(), JSON.stringify(stat));
  }

  private reloadLastGame(): void {
    const item = localStorage.getItem(this.messageService.getCurrentDateKey());
    if (typeof item === 'string' && item != '') {
      const stat:GameStat = JSON.parse(item) as GameStat;
      this.rowNumber = stat.guessNumber
      this.board = stat.board;
    }
  }
}
