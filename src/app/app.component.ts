import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessageService } from './services/message.service';
import { StatusComponent } from './status/status.component';
import { AboutComponent } from './about/about.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
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
  }

  showStatusDialog(): void {
    this.modalService.open(StatusComponent, {size: 'lg'});
  }

  showAboutDialog(): void {
    this.modalService.open(AboutComponent, {size: 'lg'});
  }
}
