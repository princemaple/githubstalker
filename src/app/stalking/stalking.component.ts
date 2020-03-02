import {Component} from '@angular/core';

@Component({
  selector: 'gs-stalking',
  templateUrl: './stalking.component.html',
})
export class StalkingComponent {
  token: string;

  constructor() {
    this.token = localStorage.getItem('token')!;
  }
}
