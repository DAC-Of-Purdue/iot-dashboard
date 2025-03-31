import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule],
})
export class AppComponent {
  constructor(private _titleService: Title) {
    this._titleService.setTitle('Digital AG Sensor Dashboard');
  }
}
