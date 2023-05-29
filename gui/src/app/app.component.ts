import { Component, OnDestroy } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { GaugeComponent } from './gauge/gauge.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgxEchartsModule,
    RouterOutlet,
    DecimalPipe,
    DatePipe,
    GaugeComponent,
  ],
})
export class AppComponent implements OnDestroy {
  public isData = false;
  private humidityTopic!: Subscription;
  public humidity!: string;
  private temperatureTopic!: Subscription;
  public temperature!: string;
  public timestamp = new Date();

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

  constructor(private _mqttService: MqttService, private titleService: Title) {
    this.titleService.setTitle('Digital AG Sensor Dashboard');
    this.humidityTopic = this._mqttService
      .observe('purdue-dac/telemetry/humidity')
      .subscribe((message: IMqttMessage) => {
        this.humidity = message.payload.toString();
        this.timestamp = new Date();
      });

    this.temperatureTopic = this._mqttService
      .observe('purdue-dac/telemetry/temperature')
      .subscribe((message: IMqttMessage) => {
        this.temperature = message.payload.toString();
        this.isData = true;
      });
  }

  ngOnDestroy(): void {
    this.humidityTopic.unsubscribe();
    this.temperatureTopic.unsubscribe();
  }
}
