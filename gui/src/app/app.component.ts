import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

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

  constructor(private _mqttService: MqttService) { 
    this.humidityTopic = this._mqttService.observe(
      'purdue-dac/telemetry/humidity'
    ).subscribe((message: IMqttMessage) => {
      this.humidity = message.payload.toString();
      console.log(this.humidity);
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
