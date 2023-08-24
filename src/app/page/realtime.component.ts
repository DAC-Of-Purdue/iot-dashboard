import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DhtGaugeComponent,
  DhtDataInterface,
} from '../gauge/dht-gauge.component';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-realtime',
  standalone: true,
  template: `
    <app-dht-gauge></app-dht-gauge>
    <table>
      <thead>
        <tr>
          <th>Device Name</th>
          <th>Temperature</th>
          <th>Humidity</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr *ngFor="let datum in data">
          <td>{{ datum.deviceName }}</td>
        </tr> -->
      </tbody>
    </table>
  `,
  styles: [],
  imports: [CommonModule, DhtGaugeComponent],
})
export class RealtimeComponent {
  private _subscrition!: Subscription;
  public data: DhtDataInterface[] = [];

  constructor(private _mqttService: MqttService) {
    this._subscrition = this._mqttService
      .observe('purdue-dac/#')
      .subscribe((message: IMqttMessage) => {
        // extract device name and data
        let topic = message.topic;
        let regexpTopic = new RegExp('purdue-dac/(.*)');
        let payload = message.payload.toString();
        let regexpPayload = new RegExp('(.*):(.*):(.*)');
        if (regexpTopic.test(topic) && regexpPayload.test(payload)) {
          let rawData = regexpPayload.exec(payload);
          this.data.push({
            deviceName: regexpTopic.exec(topic)![1],
            timestamp: Number(rawData![1]),
            temperature: Number(rawData![2]),
            humidity: Number(rawData![3]),
          });
        }
      });
  }

  ngOnDestroy(): void {
    this._subscrition.unsubscribe();
  }
}
