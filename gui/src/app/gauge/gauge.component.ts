import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class GaugeComponent implements OnChanges, OnInit {
  @Input() value?: string;
  @Input() isData = false;
  @Input() option!: EChartsOption;

  public isLoading = true;
  public gaugeUpdate!: EChartsOption;
  public gaugeOption: EChartsOption = { // Default gauge options
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
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
          color: 'inherit'
        }
      },
    ],
    title: {
      left: 'center',
      bottom: 60,
      textStyle: {
        fontSize: 20,
        color: 'Black'
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    // Update with current value
    let currentValue = changes['value'].currentValue;
    this.gaugeUpdate = {
      series: [{
        data: [{
          value: currentValue,
        }]
      }],
    }
  }

  ngOnInit(): void {
    // Options that passed from parent component
    this.gaugeUpdate = this.option;
  }

}
