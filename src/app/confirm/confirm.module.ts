import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

import {ConfirmDirective} from './confirm.directive';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  declarations: [ConfirmDirective, ConfirmDialogComponent],
  exports: [ConfirmDirective, ConfirmDialogComponent],
})
export class ConfirmModule {}
