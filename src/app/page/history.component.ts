import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DhtDataInterface } from '../gauge/dht-gauge.component';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button
      [routerLink]="['/realtime']"
      fragment="{{ this.deviceName }}"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Real-Time data
    </button>
    <nav></nav>
  `,
  styles: [],
})
export class HistoryComponent {
  public deviceName!: string;
  public data!: Array<DataInterface>;
  constructor(private _route: ActivatedRoute, private _http: HttpClient) {}

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.deviceName = params['deviceName'];
      console.log(this.deviceName);
    });
    this._http.get<DataInterface[]>(`http://localhost:8000/history/${this.deviceName}/`).subscribe((response) => {
      this.data = response;
    });
  }
}

export interface DataInterface {
  timestamp: number;
  temperature: number;
  humidity: number;
}
