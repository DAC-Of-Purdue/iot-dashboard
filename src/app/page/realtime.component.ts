import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DhtGaugeComponent,
  DhtDataInterface,
} from '../gauge/dht-gauge.component';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-realtime',
  standalone: true,
  template: `
    <app-dht-gauge
      [timestamp]="timestamp"
      [temperature]="temperature"
      [humidity]="humidity"
      [isData]="isData"
      [sensorName]="selecedSensor"
    ></app-dht-gauge>
    <table mat-table [dataSource]="datasource">
      <ng-container matColumnDef="deviceName">
        <th mat-header-cell *matHeaderCellDef>Device Name</th>
        <td mat-cell *matCellDef="let row">{{ row.deviceName }}</td>
      </ng-container>
      <ng-container matColumnDef="timestamp">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Timestamp</th>
        <td mat-cell *matCellDef="let row">
          {{ row.timestamp * 1000 | date : 'medium' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="temperature">
        <th mat-header-cell *matHeaderCellDef>Temperature</th>
        <td mat-cell *matCellDef="let row">
          {{ row.temperature | number : '.1' }}°F
        </td>
      </ng-container>
      <ng-container matColumnDef="humidity">
        <th mat-header-cell *matHeaderCellDef>Humidity</th>
        <td mat-cell *matCellDef="let row">
          {{ row.humidity | number : '.1' }}%
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: displayedColumns"
        class="mat-row"
        (click)="selectSensor(row)"
      ></tr>
    </table>
  `,
  styles: ['.mat-row:hover { background-color: #dee0e3; }'],
  imports: [CommonModule, DhtGaugeComponent, MatTableModule],
})
export class RealtimeComponent {
  private _subscrition!: Subscription;
  public displayedColumns: string[] = [
    'deviceName',
    'timestamp',
    'temperature',
    'humidity',
  ];

  public dataLatest: DhtDataInterface[] = [];
  public datasource: MatTableDataSource<DhtDataInterface> =
    new MatTableDataSource();
  public timestamp?: number;
  public temperature?: number;
  public humidity?: number;
  public isData: boolean = false;
  public selecedSensor?: string;

  constructor(
    private _mqttService: MqttService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
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
            if (this.selecedSensor === newData.deviceName) {
              this.temperature = newData.temperature;
              this.humidity = newData.humidity;
              this.timestamp = newData.timestamp;
            }
          } else {
            this.dataLatest.push(newData);
          }
          this.datasource.data = this.dataLatest;
        }
      });

    this._route.fragment.subscribe((deviceName) => {
      // Get latest device name from history page
      if (deviceName) {
        this.selecedSensor = deviceName;
      }
    });
  }

  ngAfterContentChecked() {
    // Automatically update gauge when return from another page
    if (this.isData === false) {
      let selecedSensorData = this.dataLatest.find(
        (device) => device.deviceName === this.selecedSensor
      );
      if (selecedSensorData) {
        this.selectSensor(selecedSensorData);
      }
    }
  }

  ngOnDestroy(): void {
    this._subscrition.unsubscribe();
  }

  selectSensor(row: DhtDataInterface): void {
    this.selecedSensor = row.deviceName;
    this.isData = true;
    this.temperature = row.temperature;
    this.humidity = row.humidity;
    this.timestamp = row.timestamp;
  }
}
