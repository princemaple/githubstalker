import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RecentComponent} from './recent/recent.component';
import {FormDialogComponent} from './form-dialog/form-dialog.component';
import {AgoPipe} from './ago.pipe';
import {RepoSelectorComponent} from './repo-selector/repo-selector.component';
import {RecentRepoComponent} from './recent-repo/recent-repo.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ConfirmModule} from './confirm/confirm.module';
import {StalkingComponent} from './stalking/stalking.component';
import {CallbackComponent} from './callback/callback.component';
import {AuthInterceptor} from './interceptors';

@NgModule({
  declarations: [
    AppComponent,
    StalkingComponent,
    RecentComponent,
    FormDialogComponent,
    AgoPipe,
    RepoSelectorComponent,
    RecentRepoComponent,
    CallbackComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    ConfirmModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
