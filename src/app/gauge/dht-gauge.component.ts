import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { MomentService } from '../service/moment.service';
import { Subscription } from 'rxjs';
import { Moment } from 'moment';
import { GaugeComponent } from './gauge.component';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dht-gauge',
  standalone: true,
  template: `
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
      <h3 *ngIf="lastUpdate" class="text-lg">Last Update: {{ lastUpdate | titlecase }}</h3>
      <h3 *ngIf="!lastUpdate" class="text-lg">Updating ....</h3>
    </div>
  `,
  styles: [],
  imports: [CommonModule, GaugeComponent],
})
export class DhtGaugeComponent {
  public isData = false;
  private _dhtTopic!: Subscription;
  public humidity!: string;
  public temperature!: string;
  private _timeInterval!: Subscription;
  private timestamp!: Moment;
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

  constructor(
    private _mqttService: MqttService,
    private _momentService: MomentService
  ) {
    this._dhtTopic = this._mqttService
      .observe('purdue-dac/3078-outside')
      .subscribe((message: IMqttMessage) => {
        let payload = message.payload.toString();
        console.log(message.topic + ' -> ' + payload);
        let regexp = new RegExp('(.*):(.*):(.*)');
        if (regexp.test(payload)) {
          // to validate that payload is legit
          let data = regexp.exec(payload);
          this.temperature = data![1];
          this.humidity = data![2];
          this.timestamp = this._momentService.fromEpoch(Number(data![3]));
          this.isData = true;
        }
      });
  }

  ngOnInit(): void {
    this._timeInterval = this._momentService
      .setIntervalSecond(10)
      .subscribe(() => {
        this.lastUpdate = this.timestamp.fromNow();
      });
  }

  ngOnDestroy(): void {
    this._timeInterval.unsubscribe();
    this._dhtTopic.unsubscribe();
  }
}

export interface DhtDataInterface {
  deviceName: string;
  timestamp: number;
  temperature: number;
  humidity: number | string;
}