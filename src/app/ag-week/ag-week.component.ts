import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  DhtGaugeComponent,
  DhtDataInterface,
} from 'src/app/gauge/dht-gauge.component';

import mqtt from 'mqtt';

interface Sensor {
  name: string;
  topic: string;
  type: string;
  data?: DhtDataInterface;
}

@Component({
  selector: 'app-ag-week',
  standalone: true,
  imports: [
    DhtGaugeComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './ag-week.component.html',
  styleUrl: './ag-week.component.css',
})
export class AgWeekComponent {
  deviceName!: string;
  timestamp?: number;
  temperature?: number;
  humidity?: number;
  isData: boolean = false;
  selectedSensor?: Sensor;

  sensors: Sensor[] = [
    {
      name: 'Sensor 1',
      topic: 'ag-week-demo-1',
      type: 'dht',
    },
    {
      name: 'Sensor 2',
      topic: 'ag-week-demo-2',
      type: 'dht',
    },
  ];

  constructor() {}

  ngOnInit() {
    // connect to mqtt broker
    const host = `wss://${environment.brokerUrl}:8084/mqtt`;
    console.log('connecting to mqtt broker...');
    const client = mqtt.connect(host);
    client.on('connect', () => {
      console.log('Connected to broker.');
      client.subscribe(`purdue-dac/sensor/#`);
    });
    // listen for messages
    client.on('message', (topic, message, _) => {
      // extract device name and data
      let regexpTopic = new RegExp('purdue-dac/sensor/(.*)');
      let regexpPayload = new RegExp('(.*):(.*):(.*)');
      let payload = message.toString();
      // debug raw message
      console.log(`Received message ${payload} from topic ${topic}`);
      if (regexpTopic.test(topic) && regexpPayload.test(payload)) {
        let rawData = regexpPayload.exec(payload);
        let data: DhtDataInterface = {
          deviceName: regexpTopic.exec(topic)![1],
          timestamp: Number(rawData![3]),
          temperature: Number(rawData![1]),
          humidity: Number(rawData![2]),
        };
        // update data if topic matches selected sensor
        if (this.selectedSensor?.topic === data.deviceName) {
          this.temperature = data.temperature;
          this.humidity = data.humidity;
          this.timestamp = data.timestamp;
          this.isData = true;
        }
        // record latest data
        let deviceIndex = this.sensors.findIndex(
          (sensor) => sensor.topic === data.deviceName
        );
        console.log(deviceIndex);
        if (deviceIndex !== -1) {
          this.sensors[deviceIndex].data = data;
        }
      }
    });
  }

  onSensorChange(event: MatSelectChange) {
    let selectedSensorIndex = this.sensors.findIndex(
      (sensor) => sensor.topic === event.value.topic
    );
    if (selectedSensorIndex !== -1) {
      this.deviceName = this.sensors[selectedSensorIndex].name;
      this.temperature = this.sensors[selectedSensorIndex].data?.temperature;
      this.humidity = this.sensors[selectedSensorIndex].data?.humidity;
      this.timestamp = this.sensors[selectedSensorIndex].data?.timestamp;
      this.isData = true;
    }
    this.selectedSensor = this.sensors[selectedSensorIndex];
  }
}
