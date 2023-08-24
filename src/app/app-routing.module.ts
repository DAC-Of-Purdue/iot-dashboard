import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealtimeComponent } from './page/realtime.component';

const routes: Routes = [
  {
    path: '',
    component: RealtimeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
