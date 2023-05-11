import { Component, OnDestroy } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { EChartsOption, ECharts } from 'echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'Boiler Robotics';
  private humidityTopic!: Subscription;
  public humidity!: string;
  private temperatureTopic!: Subscription;
  public temperature!: string;
  public timestamp = new Date();
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

  constructor(private _mqttService: MqttService) { 
    this.humidityTopic = this._mqttService.observe(
      'purdue-dac/telemetry/humidity'
    ).subscribe((message: IMqttMessage) => {
      this.humidity = message.payload.toString();
      console.log(this.humidity);
      this.timestamp = new Date()
    });
  }

  ngOnDestroy(): void {
    this.humidityTopic.unsubscribe();
    this.temperatureTopic.unsubscribe();
  }

  onChartInit(ec: ECharts) {
    this.gaugeInstance = ec;
    this.temperatureTopic = this._mqttService.observe(
      'purdue-dac/telemetry/temperature'
    ).subscribe((message: IMqttMessage) => {
      this.temperature = message.payload.toString();
      console.log(this.temperature);
      this.gaugeInstance.setOption({
        series: {
          data: [parseFloat(this.temperature)]
        }
      })
    });
  }

}
