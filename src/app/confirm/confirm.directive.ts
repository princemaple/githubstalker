import {
  Directive,
  Output,
  EventEmitter,
  Input,
  TemplateRef,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[confirm]',
  host: {
    '(click)': 'handleClick($event)',
  },
})
export class ConfirmDirective {
  @Input() confirmContext: any = {};
  @Input() confirmTemplate: TemplateRef<any>;

  @Output() confirm = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  handleClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {context: this.confirmContext, template: this.confirmTemplate},
      })
      .afterClosed()
      .subscribe(proceed => {
        if (proceed) {
          this.confirm.emit();
        } else {
          this.reject.emit();
        }
      });
  }
}
