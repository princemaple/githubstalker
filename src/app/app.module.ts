import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { RecentComponent } from './recent/recent.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { AgoPipe } from './ago.pipe';
import { RepoSelectorComponent } from './repo-selector/repo-selector.component';
import { RecentRepoComponent } from './recent-repo/recent-repo.component'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
  ],
  declarations: [AppComponent, RecentComponent, FormDialogComponent, AgoPipe, RepoSelectorComponent, RecentRepoComponent],
  bootstrap: [AppComponent],
  entryComponents: [FormDialogComponent]
})
export class AppModule { }
