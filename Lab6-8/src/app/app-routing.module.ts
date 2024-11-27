import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtocolComponent } from './protocol/protocol.component';
import { FactsComponent } from './facts/facts.component';

const routes: Routes = [
  { path: '', component: FactsComponent },
  { path: 'protocol', component: ProtocolComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
