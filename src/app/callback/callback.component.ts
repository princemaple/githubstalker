import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'gs-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent {
  constructor(client: HttpClient, route: ActivatedRoute, router: Router) {
    client
      .post('https://dev.pochen.me/oauth/github/login/oauth/access_token', null, {
        params: {
          client_id: 'bb333509e1fb0e20e1eb',
          code: route.snapshot.queryParams.code,
        },
      })
      .subscribe((resp: {access_token: string}) => {
        localStorage.setItem('OCTO_STALKER_GITHUB_TOKEN', resp.access_token);
        router.navigateByUrl('/');
      });
  }
}
