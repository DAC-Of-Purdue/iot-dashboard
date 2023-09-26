import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.deviceName = params['deviceName'];
      console.log(this.deviceName);
    });
  }
}
