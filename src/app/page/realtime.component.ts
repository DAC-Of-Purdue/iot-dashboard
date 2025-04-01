import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DhtGaugeComponent,
  DhtDataInterface,
} from '../gauge/dht-gauge.component';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import mqtt from 'mqtt';

@Component({
  selector: 'app-realtime',
  standalone: true,
  templateUrl: './realtime.component.html',
  styleUrl: './realtime.component.css',
  imports: [CommonModule, DhtGaugeComponent, MatTableModule],
})
export class RealtimeComponent {
  public displayedColumns: string[] = [
    'deviceName',
    'timestamp',
    'temperature',
    'humidity',
  ];

  public dataLatest: DhtDataInterface[] = [];
  public dataSource: MatTableDataSource<DhtDataInterface> =
    new MatTableDataSource();
  public timestamp?: number;
  public temperature?: number;
  public humidity?: number;
  public isData: boolean = false;
  public selectedSensor?: string;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    const host = `wss://${environment.brokerUrl}:8084/mqtt`;
    console.log('connecting to mqtt broker...');
    const client = mqtt.connect(host);
    client.on('connect', () => {
      console.log('Connected to broker.');
      client.subscribe('purdue-dac/#');
    });
    client.on('message', (topic, message, _) => {
      // extract device name and data
      let regexpTopic = new RegExp('purdue-dac/(.*)');
      let regexpPayload = new RegExp('(.*):(.*):(.*)');
      let payload = message.toString();
      // Debug message
      // console.log('Received message:', payload);
      if (regexpTopic.test(topic) && regexpPayload.test(payload)) {
        let rawData = regexpPayload.exec(payload);
        let newData = {
          deviceName: regexpTopic.exec(topic)![1],
          timestamp: Number(rawData![3]),
          temperature: Number(rawData![1]),
          humidity: Number(rawData![2]),
        };
        let indexDuplicate = this.dataLatest.findIndex(
          (device) => device.deviceName === newData.deviceName
        );
        // Replace duplicated data
        if (indexDuplicate !== -1) {
          this.dataLatest[indexDuplicate] = newData;
          // Update chart if the sensor is selected
          if (this.selectedSensor === newData.deviceName) {
            this.temperature = newData.temperature;
            this.humidity = newData.humidity;
            this.timestamp = newData.timestamp;
          }
        } else {
          this.dataLatest.push(newData);
        }
        this.dataSource.data = this.dataLatest;
      }
    });

    this._route.fragment.subscribe((deviceName) => {
      // Get latest device name from history page
      if (deviceName) {
        this.selectedSensor = deviceName;
      }
    });
  }

  ngAfterContentChecked() {
    // Automatically update gauge when return from another page
    if (this.isData === false) {
      let selectedSensorData = this.dataLatest.find(
        (device) => device.deviceName === this.selectedSensor
      );
      if (selectedSensorData) {
        this.selectSensor(selectedSensorData);
      }
    }
  }

  selectSensor(row: DhtDataInterface): void {
    this.selectedSensor = row.deviceName;
    this.isData = true;
    this.temperature = row.temperature;
    this.humidity = row.humidity;
    this.timestamp = row.timestamp;
  }
}
