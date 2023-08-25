import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DhtGaugeComponent,
  DhtDataInterface,
} from '../gauge/dht-gauge.component';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-realtime',
  standalone: true,
  template: `
    <app-dht-gauge></app-dht-gauge>
    <table mat-table [dataSource]="datasource">
      <ng-container matColumnDef="deviceName">
        <th mat-header-cell *matHeaderCellDef>Device Name</th>
        <td mat-cell *matCellDef="let row">{{ row.deviceName }}</td>
      </ng-container>
      <ng-container matColumnDef="timestamp">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Timestamp</th>
        <td mat-cell *matCellDef="let row">{{ row.timestamp }}</td>
      </ng-container>
      <ng-container matColumnDef="temperature">
        <th mat-header-cell *matHeaderCellDef>Temperature</th>
        <td mat-cell *matCellDef="let row">{{ row.temperature }}</td>
      </ng-container>
      <ng-container matColumnDef="humidity">
        <th mat-header-cell *matHeaderCellDef>Humidity</th>
        <td mat-cell *matCellDef="let row">{{ row.humidity }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [],
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
  public dataMQTT: DhtDataInterface[] = [];
  public datasource: MatTableDataSource<DhtDataInterface> =
    new MatTableDataSource();

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
          this.dataMQTT.push({
            deviceName: regexpTopic.exec(topic)![1],
            timestamp: Number(rawData![3]),
            temperature: Number(rawData![1]),
            humidity: Number(rawData![2]),
          });
          this.datasource.data = this.dataMQTT;
        }
      });
  }

  ngOnDestroy(): void {
    this._subscrition.unsubscribe();
  }
}
