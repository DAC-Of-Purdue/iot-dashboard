import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe],
})
export class AppComponent {
  constructor(private _titleService: Title) {
    this._titleService.setTitle('Digital AG Sensor Dashboard');
  }
}
