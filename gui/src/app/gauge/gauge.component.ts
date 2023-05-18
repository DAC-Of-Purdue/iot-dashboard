import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECharts, EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  template: `
    <div 
      echarts [options]="gaugeOption">
    </div>
  `,
  styles: [
  ]
})
export class GaugeComponent {
  private gaugeInstance!: ECharts;
  public gaugeOption: EChartsOption = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        min: 40,
        max: 100,
        splitNumber: 12,
        itemStyle: {
          color: '#FFAB91'
        },
        progress: {
          show: true,
          width: 30
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 40,
          fontWeight: 'bolder',
          formatter: (value) => {
            return  `${value.toFixed(2)} °F`;
          },
          color: 'inherit'
        },
      },
    ],
    title: {
      text: 'Temperature',
      left: 'center',
      textStyle: {
        fontSize: 25,
        color: '#FFAB91'
      }
    }
  };

  

}
