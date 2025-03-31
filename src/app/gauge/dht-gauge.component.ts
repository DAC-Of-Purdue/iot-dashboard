import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentService } from '../service/moment.service';
import { Subscription } from 'rxjs';
import { GaugeComponent } from './gauge.component';
import { EChartsOption } from 'echarts';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dht-gauge',
  standalone: true,
  templateUrl: './dht-gauge.component.html',
  styleUrl: './dht-gauge.component.css',
  imports: [CommonModule, GaugeComponent, RouterModule],
})
export class DhtGaugeComponent {
  @Input() timestamp?: number;
  @Input() temperature?: number;
  @Input() humidity?: number;
  @Input() isData = false;
  @Input() sensorName?: string;

  private _timeInterval!: Subscription;
  public lastUpdate?: string;

  public temperatureGaugeOption: EChartsOption = {
    title: {
      text: 'Temperature',
    },
    series: {
      min: 40,
      max: 100,
      splitNumber: 12,
      detail: {
        formatter: (value) => {
          return `${value.toFixed(1)} °F`;
        },
      },
    },
  };

  public humidityGaugeOption: EChartsOption = {
    title: {
      text: 'Relative\nHumidity',
    },
    series: {
      detail: {
        formatter: (value) => {
          return `${value.toFixed(1)} %`;
        },
      },
    },
  };

  constructor(private _momentService: MomentService) {}

  ngOnInit(): void {
    this._timeInterval = this._momentService
      .setIntervalSecond(10)
      .subscribe(() => {
        if (this.isData) {
          this.lastUpdate = this._momentService
            .fromEpoch(this.timestamp!)
            .fromNow();
        }
      });
  }

  ngOnDestroy(): void {
    this._timeInterval.unsubscribe();
  }
}

export interface DhtDataInterface {
  deviceName: string;
  timestamp: number;
  temperature: number;
  humidity: number;
}
