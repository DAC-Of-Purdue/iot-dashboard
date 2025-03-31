import { Component } from '@angular/core';
import { GaugeComponent } from '../gauge/gauge.component';

@Component({
  selector: 'app-weight',
  standalone: true,
  imports: [GaugeComponent],
  templateUrl: './weight.component.html',
  styleUrl: './weight.component.css',
})
export class WeightComponent {}
