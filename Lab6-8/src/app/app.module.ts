import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProtocolComponent } from './protocol/protocol.component';
import { FactsComponent } from './facts/facts.component';
import { RulesComponent } from './rules/rules.component';
import { AlgorithmComponent } from './algorithm/algorithm.component';

@NgModule({
  declarations: [
    AppComponent,
    ProtocolComponent,
    FactsComponent,
    RulesComponent,
    AlgorithmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
