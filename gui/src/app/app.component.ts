import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'Boiler Robotics';
  private humidityTopic!: Subscription;
  public humidity!: string;
  private temperatureTopic!: Subscription;
  public temperature!: string;
  public timestamp = new Date();
  
  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  constructor(private _mqttService: MqttService) { 
    this.humidityTopic = this._mqttService.observe(
      'purdue-dac/telemetry/humidity'
    ).subscribe((message: IMqttMessage) => {
      this.humidity = message.payload.toString();
      console.log(this.humidity);
      this.timestamp = new Date()
    });
    this.temperatureTopic = this._mqttService.observe(
      'purdue-dac/telemetry/temperature'
    ).subscribe((message: IMqttMessage) => {
      this.temperature = message.payload.toString()
      console.log(this.temperature);
    })
  }

  ngOnDestroy(): void {
    this.humidityTopic.unsubscribe();
    this.temperatureTopic.unsubscribe();
  }

}
