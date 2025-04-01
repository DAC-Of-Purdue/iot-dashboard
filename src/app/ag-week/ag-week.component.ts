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
  data?: DhtDataInterface | number;
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
      name: 'Pot 1',
      topic: 'ag-week-demo-1',
      type: 'dht',
    },
    {
      name: 'Pot 2',
      topic: 'ag-week-demo-2',
      type: 'dht',
    },
    {
      name: 'Pot 3',
      topic: 'ag-week-demo-3',
      type: 'soil',
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
      // client.publish('purdue-dac/command/ag-week-demo-1', '1', { qos: 2 });
    });
    // listen for messages
    client.on('message', (topic, message, _) => {
      let payload = message.toString();
      // debug raw message
      console.log(`Received message ${payload} from topic ${topic}`);
      // extract device name and data
      let regexpTopic = new RegExp('purdue-dac/sensor/(.*)');
      let deviceName = regexpTopic.exec(topic);
      let sensor = this.sensors.find(
        (sensor) => sensor.topic === deviceName![1]
      );
      if (sensor?.type === 'dht') {
        let regexpPayload = new RegExp('(.*):(.*):(.*)');
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
            this.isData = true;
            this.timestamp = data.timestamp;
            this.humidity = data.humidity;
            this.temperature = data.temperature;
          }

          // record latest data
          let deviceIndex = this.sensors.findIndex(
            (sensor) => sensor.topic === data.deviceName
          );
          if (deviceIndex !== -1) {
            this.sensors[deviceIndex].data = data;
          }
        }
      }
    });
  }

  onSensorChange(event: MatSelectChange) {
    let selectedSensorIndex = this.sensors.findIndex(
      (sensor) => sensor.topic === event.value.topic
    );
    if (
      selectedSensorIndex !== -1 &&
      this.sensors[selectedSensorIndex].type === 'dht'
    ) {
      let data = this.sensors[selectedSensorIndex].data as DhtDataInterface;
      if (data === undefined) {
        this.isData = false;
      } else {
        this.deviceName = this.sensors[selectedSensorIndex].name;
        this.temperature = data.temperature;
        this.humidity = data.humidity;
        this.timestamp = data.timestamp;
        this.isData = true;
      }
    }
    this.selectedSensor = this.sensors[selectedSensorIndex];
  }
}
