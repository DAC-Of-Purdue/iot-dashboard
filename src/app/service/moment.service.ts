import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MomentService {
  constructor() {}

  getCurrentTime() {
    return moment.utc();
  }

  setIntervalSecond(second: number) {
    return interval(second * 1000);
  }
}
