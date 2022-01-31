import { Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { ClipboardService } from 'ngx-clipboard';

import { GameStat, Row, Card } from '../board/board.component'
import { MessageService } from '../services/message.service'

@Component({
  selector: 'status-modal',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  playCount: number;
  winCount: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: number[] = [0,0,0,0,0,0];
  isDone: boolean;
  clipboard: string;

  barChartOptions: ChartConfiguration['options'] = {    
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: { 
        ticks: {   
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  barChartType: ChartType = 'bar';  
  barChartData: ChartData<'bar'> = {
    labels: [1, 2, 3, 4, 5, 6],
    datasets: []    
  }

  countDownCfg: CountdownConfig = {
    leftTime: this.getSecondsUntilMidNightLocalTime()
  };

  constructor(public activeModal: NgbActiveModal, 
              private messageService: MessageService,
              private clipboardService: ClipboardService) { 
    this.playCount = 0;
    this.winCount = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;
    this.isDone = false;
  }

  ngOnInit(): void {
    if (localStorage.length > 0) {
      for (var key in localStorage) {
        const item = localStorage.getItem(key);                
        if (typeof item === 'string' && item !== '') { 
          const stat:GameStat = JSON.parse(item) as GameStat;
          if (isNaN(parseInt(key))) {
            continue; // don't count
          } else if (key === this.messageService.getCurrentDateKey()) {
            if (stat.inProgress) {
              this.isDone = false;
              continue; // don't count incomplete games
            } else {
              this.generatePlay(key, stat);
              this.isDone = true;              
            }            
          } else {
            if (stat.inProgress) continue; // don't count incomplete games            
          }        
          this.playCount++;
          this.generateStats(stat);
        }      
      }

      this.barChartData.datasets.push(
        { data: this.guessDistribution, label: 'Guess Distribution', backgroundColor: '#2c3e50' }
      );      
    }
  }

  // events
  public handleCountDownEvent( event:CountdownEvent ): void {
    if (event.action === 'done') {
      // ready for new game
      this.messageService.newGame();
      this.activeModal.close();
    }
  }

  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public generateStats(stat:GameStat): void {
    // generate stat
    if (stat.isWin) {
      this.winCount++;
      this.currentStreak++;
      this.guessDistribution[stat.guessNumber]++;

      if (this.currentStreak > this.bestStreak) {
        this.bestStreak = this.currentStreak;
      }
    } else {            
      this.currentStreak = 0;          
    }
  }

  public share(): void {
    this.clipboardService.copyFromContent(this.clipboard)
  }

  private getSecondsUntilMidNightLocalTime(): number {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
    );
    var msTillMidnight = night.getTime() - now.getTime();

    return msTillMidnight / 1000;
  }

  private generatePlay(key:string, stat:GameStat): void {
    this.clipboard = 'WordHex #' + key + ' ';
    if (stat.isWin) {
        this.clipboard += stat.guessNumber;
        this.clipboard += '/6\n\n';
    } else {
      this.clipboard += String.fromCodePoint(0x1F648);
      this.clipboard += String.fromCodePoint(0x1F649);
      this.clipboard += String.fromCodePoint(0x1F64A);
      this.clipboard += '\n\n';
    }
    
    stat.board.forEach(row => {
      row.cards.forEach(card => {
        switch(card.hint) {
          case 1:
            this.clipboard += String.fromCodePoint(0x1F7E9);
            this.clipboard += ' ';
            break;
          case 2: 
            this.clipboard += String.fromCodePoint(0x1F7E7);
            this.clipboard += ' ';
            break;
          default:
            this.clipboard += String.fromCodePoint(0x2B1B);
            this.clipboard += ' ';
            break;
        }        
      });
      this.clipboard += '\n';
    });    
  }
}
