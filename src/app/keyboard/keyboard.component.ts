import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Keyboard from 'simple-keyboard';

import { MessageService, Result } from '../services/message.service'
import { StatusComponent } from '../status/status.component';
import { GameStat, Row, Card } from '../board/board.component';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements AfterViewInit, OnInit {

  keyboard: Keyboard;
  guess: string;
  keysUsed: string[];
  keysHit: string[];
  keysMiss: string[]
  isDone: boolean = false;

  constructor(private messageService: MessageService, private modalService: NgbModal) {
    this.guess = '';
    this.keysUsed = [];
    this.keysHit = [];
    this.keysMiss = [];
  }

  ngOnInit(): void {
    this.messageService.getResult().subscribe({
      next: (result: Result) => {
        if (result.isSuccess) {
          this.modalService.open(StatusComponent);
        } else {
          this.clearButtonThemes();
          for (let idx = 0; idx < result.hints.length; idx++) {
            const hint: number = result.hints[idx];
            const key: string = this.guess.substring(idx, idx+1);

            if (hint === 1) {              
              this.keysHit.push(key);
              this.keysUsed = this.keysUsed.filter(item => item !== key);
            } else if (hint === 2) {
              this.keysMiss.push(key);
              this.keysUsed = this.keysUsed.filter(item => item !== key);
            }
          }
          this.guess = '';
          this.updateButtonThemes();
        }
      },          
      error: (e) => console.log(e),
      complete: () => console.log('result::done')
    }); 

    this.messageService.getReloadKeyBoardNotification().subscribe({
      next: (refresh:boolean) => {
        this.isDone = refresh;
        this.reloadLastGame();
      },
      error: (e) => console.log(e),
      complete: () => console.log('hints::done')
    });
  }
  
  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onKeyPress: (button:string) => this.onKeyPress(button),
      layout: {
        'default': [
          'Q W E R T Y U I O P',
          'A S D F G H J K L',
          '{check} Z X C V B N M {bksp}'
        ]
      },
      display: {
        '{check}': '✓',
        '{bksp}': 'DEL'
      },
      buttonTheme: [
        {
          class: 'selectedGreen',
          buttons: '{bksp}'
        },
        {
          class: 'enteredInvalidWord',
          buttons: '{check}'
        }
      ]
    });
    
    // initialize
    this.messageService.init();
  }

  private onKeyPress(key: string) : void {
    if (this.isDone) {
      console.log('game #' + this.messageService.getCurrentDateKey() + ' has ended! please wait for next to be available');
    } else {
      const len = this.guess.length;

      if (len === 6) {
        if (key === '{check}') {
          this.messageService.validateAndMatch(this.guess);
        } else if (key === '{bksp}'){
          this.guess = this.guess.substring(0, len - 1);
          this.messageService.sendKey('{bksp}');
          this.resetButtonThemes();
        }
      } else {
        if (key === '{bksp}' && len > 0) {
          this.guess = this.guess.substring(0, len - 1);
          this.messageService.sendKey('{bksp}');
          this.clearButtonThemes();
          this.keysUsed.pop()
          this.updateButtonThemes()
        } else if (key !== '{bksp}'){
          this.clearButtonThemes();
          this.keysUsed.push(key)
          this.updateButtonThemes()
          this.messageService.sendKey(key);
          this.guess += key;
        }

        if (this.guess.length === 6) {
          this.keyboard.removeButtonTheme('{check}', 'enteredInvalidWord');
          this.keyboard.removeButtonTheme('{bksp}', 'selectedGreen');
          this.keyboard.addButtonTheme('{bksp} {check}', 'selectedGreen');
        }
      }        
    }
  };

  private resetButtonThemes() : void {
    this.keyboard.removeButtonTheme('{bksp} {check}', 'selectedGreen');
    this.keyboard.addButtonTheme('{bksp}', 'selectedGreen');
    this.keyboard.addButtonTheme('{check}', 'enteredInvalidWord');
  }

  private clearButtonThemes() : void {
    this.keyboard.removeButtonTheme(this.keysUsed.join(' '), 'selectedUsed');
    this.keyboard.removeButtonTheme(this.keysHit.join(' '), 'selectedHit');
    this.keyboard.removeButtonTheme(this.keysMiss.join(' '), 'selectedMiss');
  }

  private updateButtonThemes() : void {
    this.keyboard.addButtonTheme(this.keysUsed.join(' '), 'selectedUsed');
    this.keyboard.addButtonTheme(this.keysHit.join(' '), 'selectedHit');
    this.keyboard.addButtonTheme(this.keysMiss.join(' '), 'selectedMiss');
  }

  private reloadLastGame() : void {
    const item = localStorage.getItem(this.messageService.getCurrentDateKey());
    if (typeof item === 'string' && item != '') {
      const stat:GameStat = JSON.parse(item) as GameStat;      
      const board:Row[] = stat.board;
      board.forEach( (row:Row) => {
        row.cards.forEach( (card:Card) => {
          if (card.hint === 3) {
            this.keysUsed.push(card.key);
          } else if (card.hint === 2) {
            this.keysMiss.push(card.key);
          } else if (card.hint === 1) {
            this.keysHit.push(card.key);
          }
        });
      });
      
      this.updateButtonThemes();
    }
  }
}
