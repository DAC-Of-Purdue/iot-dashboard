import { Component, OnDestroy } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { GaugeComponent } from './gauge/gauge.component';

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
      GaugeComponent
    ]
})
export class AppComponent implements OnDestroy{
  title = 'Boiler Robotics';
  public isData = false;
  private humidityTopic!: Subscription;
  public humidity!: string;
  private temperatureTopic!: Subscription;
  public temperature!: string;
  public timestamp = new Date();

  constructor(private _mqttService: MqttService) { 
    this.humidityTopic = this._mqttService.observe(
      'purdue-dac/telemetry/humidity'
    ).subscribe((message: IMqttMessage) => {
      this.humidity = message.payload.toString();
      this.timestamp = new Date()
    });

    this.temperatureTopic = this._mqttService.observe(
      'purdue-dac/telemetry/temperature'
    ).subscribe((message: IMqttMessage) => {
      this.temperature = message.payload.toString();
      this.isData = true;
    });
  }

  ngOnDestroy(): void {
    this.humidityTopic.unsubscribe();
    this.temperatureTopic.unsubscribe();
  }
}
