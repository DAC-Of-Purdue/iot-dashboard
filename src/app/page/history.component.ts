import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      routerLink="/realtime"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      <a routerLink="/realtime" routerLinkActive="active">Real-Time data</a>
    </button>
    <nav></nav>
  `,
  styles: [],
})
export class HistoryComponent {}
