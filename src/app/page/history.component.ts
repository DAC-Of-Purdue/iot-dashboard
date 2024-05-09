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
            period: '7d',
          },
        }
      )
      .subscribe((data) => {
        data.forEach((value, index, array) => {
          array[index].time = new Date(value.time);
        });
        console.table(data);
        this.chartOption = {
          xAxis: {
            type: 'time',
            axisLabel: {
              color: 'white',
            },
          },
          yAxis: [
            {
              type: 'value',
              name: 'Temperature',
              nameTextStyle: {
                color: 'white',
                fontSize: 18,
              },
              axisLabel: {
                formatter: '{value}°F',
                color: 'white',
              },
            },
            {
              type: 'value',
              name: 'Humidity',
              nameTextStyle: {
                color: 'white',
                fontSize: 18,
              },
              axisLabel: {
                formatter: '{value}%',
                color: 'white',
              },
              min: 0,
              max: 100,
            },
          ],
          tooltip: {
            trigger: 'axis',
          },
          series: [
            {
              data: data.map((record) => [record.time, record.temperature]),
              type: 'line',
              name: 'Temperature',
              smooth: true,
              showSymbol: false,
              tooltip: {
                valueFormatter: (value) => (value as number).toFixed(1) + '°F',
              },
            },
            {
              data: data.map((record) => [record.time, record.humidity]),
              type: 'line',
              name: 'Humidity',
              smooth: true,
              showSymbol: false,
              yAxisIndex: 1,
              tooltip: {
                valueFormatter(value) {
                  return (value as number).toFixed(1) + '%';
                },
              },
            },
          ],
        };
      });
  }
}

export interface DataInterface {
  time: Date | string;
  temperature: number;
  humidity: number;
}
