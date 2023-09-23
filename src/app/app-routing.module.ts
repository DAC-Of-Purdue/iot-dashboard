import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealtimeComponent } from './page/realtime.component';
import { HistoryComponent } from './page/history.component';

const routes: Routes = [
  {
    path: 'realtime',
    component: RealtimeComponent,
  },
  { path: 'history', component: HistoryComponent },
  {
    path: '**',
    redirectTo: '/realtime',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
