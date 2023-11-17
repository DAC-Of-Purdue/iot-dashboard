import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxEchartsDirective],
  template: `
    <button
      [routerLink]="['/realtime']"
      fragment="{{ this.deviceName }}"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Real-Time data
    </button>
    <div echarts [options]="chartOption"></div>
  `,
  styles: [],
  providers: [provideEcharts()],
})
export class HistoryComponent {
  public deviceName!: string;
  public chartOption!: EChartsOption;

  constructor(private _route: ActivatedRoute, private _http: HttpClient) {}

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.deviceName = params['deviceName'];
    });
    this._http
      .get<DataInterface[]>(
        `http://${environment.apiUrl}/history/${this.deviceName}`,
        {
          params: {
            period: '3d',
          },
        }
      )
      .subscribe((data) => {
        console.table(data);
        this.chartOption = {
          xAxis: {
            type: 'time',
          },
          yAxis: {
            type: 'value',
            name: 'Temperature',
            axisLabel: {
              formatter: '{value} °F',
            },
          },
          tooltip: {
            position: 'top',
            trigger: 'item',
            formatter: '{c}',
          }, 
          series: [
            {
              data: data.map((record) => [record.time, record.temperature]),
              type: 'line',
              smooth: true,
              tooltip: {
                formatter: '{value} °F'
              }
            },
          ],
        };
      });
  }
}

export interface DataInterface {
  time: string;
  temperature: number;
  humidity: number;
}
