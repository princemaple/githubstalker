import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StalkingComponent} from './stalking/stalking.component';
import {CallbackComponent} from './callback/callback.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: StalkingComponent},
  {path: 'callback', component: CallbackComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
