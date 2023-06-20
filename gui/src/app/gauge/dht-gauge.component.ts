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
      <h3 class="text-lg">Last Update: {{ lastUpdate | titlecase }}</h3>
      <p class="font-light text-sm">
        Note: This is receiving time on the client side a.k.a. your browser
      </p>
    </div>
  `,
  styles: [],
  imports: [CommonModule, GaugeComponent],
})
export class DhtGaugeComponent {
  public isData = false;
  private _humidityTopic!: Subscription;
  public humidity!: string;
  private _temperatureTopic!: Subscription;
  public temperature!: string;
  private _timeInterval!: Subscription;
  private timestamp!: Moment;
  public lastUpdate: string = 'updating...';

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
    this._humidityTopic = this._mqttService
      .observe('purdue-dac/telemetry/humidity')
      .subscribe((message: IMqttMessage) => {
        this.humidity = message.payload.toString();
        this.timestamp = this._momentService.getCurrentTime();
      });

    this._temperatureTopic = this._mqttService
      .observe('purdue-dac/telemetry/temperature')
      .subscribe((message: IMqttMessage) => {
        this.temperature = message.payload.toString();
        this.isData = true;
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
    this._humidityTopic.unsubscribe();
    this._temperatureTopic.unsubscribe();
    this._timeInterval.unsubscribe();
  }
}
