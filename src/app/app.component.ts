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
  }
}
