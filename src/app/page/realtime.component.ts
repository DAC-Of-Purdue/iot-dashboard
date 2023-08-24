import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DhtGaugeComponent } from '../gauge/dht-gauge.component';

@Component({
    selector: 'app-realtime',
    standalone: true,
    template: `
    <app-dht-gauge></app-dht-gauge>
  `,
    styles: [],
    imports: [CommonModule, DhtGaugeComponent]
})
export class RealtimeComponent {

}
