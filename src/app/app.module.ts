import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CountdownComponent } from 'ngx-countdown';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { StatusComponent } from './status/status.component';
import { AboutComponent } from './about/about.component';
import { RickedComponent } from './ricked/ricked.component';

@NgModule({ declarations: [
        AppComponent,
        BoardComponent,
        KeyboardComponent,
        StatusComponent,
        AboutComponent,
        RickedComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        NgbModule,
        BaseChartDirective,
        CountdownComponent,
        ClipboardModule], providers: [provideHttpClient(withInterceptorsFromDi()), provideCharts(withDefaultRegisterables())] })
export class AppModule { }
