import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './gauge.component.html',
  styleUrl: './gauge.component.css',
  providers: [provideEcharts()],
})
export class GaugeComponent implements OnChanges, OnInit {
  @Input() value?: number;
  @Input() isData = false;
  @Input() option!: EChartsOption;
  @Input() normalRange!: Array<number>;

  public isLoading = true;
  public gaugeUpdate!: EChartsOption;
  public gaugeOption: EChartsOption = {
    // Default gauge options
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        progress: {
          show: true,
          width: 30,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 30,
          },
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: 'white',
          },
        },
        splitLine: {
          distance: -40,
          length: 15,
          lineStyle: {
            width: 3,
            color: 'white',
          },
        },
        axisLabel: {
          distance: -20,
          color: 'white',
          fontSize: 20,
        },
        anchor: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 40,
          fontWeight: 'bolder',
          color: 'inherit',
        },
      },
    ],
    title: {
      left: 'center',
      bottom: 60,
      textStyle: {
        fontSize: 20,
        color: 'white',
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    // Update with current value
    let currentValue: number = changes['value'].currentValue;
    let color = 'green';
    if (currentValue < this.normalRange[0]) {
      color = 'blue';
    } else if (currentValue > this.normalRange[1]) {
      color = 'red';
    }
    this.gaugeUpdate = {
      series: [
        {
          data: [
            {
              value: currentValue,
            },
          ],
          itemStyle: {
            color: color,
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    // Options that passed from parent component
    this.gaugeUpdate = this.option;
  }
}
