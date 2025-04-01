import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { DhtGaugeComponent } from 'src/app/gauge/dht-gauge.component';

import mqtt from 'mqtt';

@Component({
  selector: 'app-dht',
  standalone: true,
  imports: [DhtGaugeComponent],
  templateUrl: './dht.component.html',
  styleUrl: './dht.component.css',
})
export class DhtComponent {
  public deviceName!: string;
  public timestamp?: number;
  public temperature?: number;
  public humidity?: number;
  public isData: boolean = false;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    // get device name from route params
    this._route.params.subscribe((params) => {
      this.deviceName = params['deviceName'];
    });
    console.log('Device name:', this.deviceName);
    // connect to mqtt broker
    const host = `wss://${environment.brokerUrl}:8084/mqtt`;
    console.log('connecting to mqtt broker...');
    const client = mqtt.connect(host);
    client.on('connect', () => {
      console.log('Connected to broker.');
      // subscribe to topic that matches the device name
      client.subscribe(`purdue-dac/sensor/${this.deviceName}`);
    });
    // listen for messages
    client.on('message', (topic, message, _) => {
      // extract device name and data
      let regexpTopic = new RegExp('purdue-dac/sensor/(.*)');
      let regexpPayload = new RegExp('(.*):(.*):(.*)');
      let payload = message.toString();
      // Debug raw message
      console.log(`Received message ${payload} from device ${this.deviceName}`);
      if (regexpTopic.test(topic) && regexpPayload.test(payload)) {
        let rawData = regexpPayload.exec(payload);
        this.timestamp = Number(rawData![3]);
        this.temperature = Number(rawData![1]);
        this.humidity = Number(rawData![2]);
        this.isData = true;
      }
    });
  }
}
