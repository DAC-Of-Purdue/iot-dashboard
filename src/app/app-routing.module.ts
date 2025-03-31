import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealtimeComponent } from './page/realtime.component';
import { HistoryComponent } from './page/history.component';
import { WeightComponent } from './weight/weight.component';

const routes: Routes = [
  {
    path: 'realtime',
    component: RealtimeComponent,
  },
  { path: 'history/:deviceName', component: HistoryComponent },
  { path: 'weight', component: WeightComponent },
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
