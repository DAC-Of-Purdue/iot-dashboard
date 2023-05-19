import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  template: `
    <div echarts
      [options]="gaugeOption"
      [merge]="gaugeUpdate"
      [loading]="!isData">
    </div>
  `,
  styles: [
  ]
})
export class GaugeComponent implements OnChanges {
  @Input() value?: string;
  @Input() isData = false;

  public isLoading = true;
  public gaugeUpdate!: EChartsOption;
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
        }
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

  ngOnChanges(changes: SimpleChanges){
    let currentValue = changes['value'].currentValue;
    this.gaugeUpdate = {
      series: [{
        data: [currentValue]
      }]
    }
  }

}
