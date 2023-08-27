import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentService } from '../service/moment.service';
import { Subscription } from 'rxjs';
import { GaugeComponent } from './gauge.component';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dht-gauge',
  standalone: true,
  template: `
    <div class="m-3 text-center" *ngIf="isData">
      <h2 class="text-3xl">
        {{ sensorNane?.replaceAll('-', ' ') | titlecase }}
      </h2>
    </div>
    <div class="columns-1 lg:columns-2 px-1">
      <app-gauge
        [value]="temperature"
        [isData]="isData"
        [option]="temperatureGaugeOption"
        [normalRange]="[55, 85]"
      >
      </app-gauge>
      <app-gauge
        [value]="humidity"
        [isData]="isData"
        [option]="humidityGaugeOption"
        [normalRange]="[20, 80]"
      >
      </app-gauge>
    </div>
    <div class="m-3 text-center">
      <h3 *ngIf="lastUpdate" class="text-lg">
        Last Update: {{ lastUpdate | titlecase }}
      </h3>
      <h3 *ngIf="!lastUpdate" class="text-lg">Updating ....</h3>
    </div>
    <div class="m-3 text-center" *ngIf="!isData">
      <h2 class="text-3xl text-red-600">
        Click on the table below to select sensor to be displayed
      </h2>
    </div>
  `,
  styles: [],
  imports: [CommonModule, GaugeComponent],
})
export class DhtGaugeComponent {
  @Input() timestamp?: number;
  @Input() temperature?: number;
  @Input() humidity?: number;
  @Input() isData = false;
  @Input() sensorNane?: string;

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
