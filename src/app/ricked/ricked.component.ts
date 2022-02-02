import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ricked',
  templateUrl: './ricked.component.html',
  styleUrls: ['./ricked.component.scss']
})
export class RickedComponent {

  @Input() public key: string;

  constructor(public activeModal: NgbActiveModal, private sanitizer:DomSanitizer) { 
    this.key = '';
  }

  getUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.key + '?autoplay=1&mute=1');
  }
}
