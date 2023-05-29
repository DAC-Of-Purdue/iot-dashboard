import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { GaugeComponent } from './gauge/gauge.component';
import { Title } from '@angular/platform-browser';
import { MomentService } from './service/moment.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgxEchartsModule,
    RouterOutlet,
    DecimalPipe,
    GaugeComponent,
    TitleCasePipe,
  ],
})
export class AppComponent implements OnDestroy, OnInit {
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
          return `${value.toFixed(2)} °F`;
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
          return `${value.toFixed(2)} %`;
        },
      },
    },
  };

  constructor(
    private _mqttService: MqttService,
    private _titleService: Title,
    private _momentService: MomentService
  ) {
    this._titleService.setTitle('Digital AG Sensor Dashboard');
    this.timestamp = this._momentService.getCurrentTime();
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
