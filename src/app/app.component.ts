import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessageService, Result } from './services/message.service';
import { StatusComponent } from './status/status.component';
import { AboutComponent } from './about/about.component';
import { RickedComponent } from './ricked/ricked.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private modalRef: any;
  constructor(private messageService: MessageService, private modalService: NgbModal) { }

  ngOnInit(): void {    
    this.messageService.isReady().subscribe((isReady:boolean) => {
      if (!isReady) {
        // notify board to load last game stat
        this.messageService.reloadLastGame(true);
        // load status dialog
        this.showStatusDialog();
      }
    });

    this.messageService.getEasterEgg().subscribe((key:string) => {
      setTimeout(() => {
        this.modalRef = this.modalService.open(RickedComponent, {size: 'lg'});
        this.modalRef.componentInstance.key = key;
        this.modalRef.dismissed.subscribe(() => {
          this.messageService.sendResult({isNaW: true} as Result);
        })
      },500);      
    });
  }

  showStatusDialog(): void {
    this.modalService.open(StatusComponent, {size: 'lg'});
  }

  showAboutDialog(): void {
    this.modalService.open(AboutComponent, {size: 'lg'});
  }
}
