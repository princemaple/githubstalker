import {Component, OnInit} from '@angular/core';

import {MatDialog} from '@angular/material/dialog';
import {
  FormDialogComponent,
  TemplateData,
} from './form-dialog/form-dialog.component';

@Component({
  selector: 'gs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  token: string;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.token = localStorage.getItem('token')!;

    if (!this.token) {
      this.getToken();
    }
  }

  getToken() {
    this.dialog
      .open(FormDialogComponent, {
        data: {
          fields: [{label: 'Token', required: true, name: 'token'}],
        } as TemplateData,
      })
      .afterClosed()
      .subscribe(({token}) => {
        this.token = token;
        localStorage.setItem('token', token);
      });
  }
}
