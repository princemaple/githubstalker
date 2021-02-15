import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {BehaviorSubject} from 'rxjs';
import {filter, mergeAll, switchMap, tap} from 'rxjs/operators';
import {flatten} from 'lodash-es';

import {FormDialogComponent} from '../form-dialog/form-dialog.component';
import {HttpClient} from '@angular/common/http';

type Repos = {[owner: string]: string[]};

const InitRepos: Repos = {
  angular: ['angular', 'components'],
  'elixir-lang': ['elixir'],
  caddyserver: ['caddy'],
};

@Component({
  selector: 'repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.scss'],
})
export class RepoSelectorComponent implements OnInit {
  _repos: Repos = InitRepos;
  _repoInfo: any = {};

  repos = new BehaviorSubject<string[]>([]);

  private _showRepos: boolean;
  get showRepos() {
    return this._showRepos;
  }
  set showRepos(v: boolean) {
    this._showRepos = v;
    localStorage.setItem('showRepos', JSON.stringify(v));
  }

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this._showRepos = JSON.parse(localStorage.getItem('showRepos') || 'true');

    let repos;
    if ((repos = localStorage.getItem('repos'))) {
      this._repos = JSON.parse(repos);
    }

    this.emitRepos();
  }

  private emitRepos() {
    this.repos.next(this.flattenRepos(this._repos));
    this.loadIssuesAndPulls();
  }

  private flattenRepos(repos: Repos) {
    return flatten(Object.keys(repos).map(owner => repos[owner].map(repo => `${owner}/${repo}`)));
  }

  private loadIssuesAndPulls() {
    Object.entries(this._repos).forEach(([orgOrUser, repos]) => {
      if (!this._repoInfo[orgOrUser]) {
        this._repoInfo[orgOrUser] = {};
      }

      repos.forEach(repo => {
        if (!this._repoInfo[orgOrUser][repo]) {
          this._repoInfo[orgOrUser][repo] = {};
        } else if (
          this._repoInfo[orgOrUser][repo].pulls &&
          this._repoInfo[orgOrUser][repo].issues
        ) {
          return;
        }

        this.http
          .get(`https://api.github.com/repos/${orgOrUser}/${repo}/pulls`, {
            params: {state: 'open', per_page: '100'},
          })
          .subscribe(data => {
            this._repoInfo[orgOrUser][repo].pulls = data;
          });

        this.http
          .get(`https://api.github.com/repos/${orgOrUser}/${repo}/issues`, {
            params: {state: 'open', per_page: '100'},
          })
          .subscribe(data => {
            this._repoInfo[orgOrUser][repo].issues = data;
          });
      });
    });
  }

  addRepo(repos: Repos, key: string) {
    this.dialog
      .open(FormDialogComponent, {
        data: {
          title: '+Repo',
          fields: [{name: 'name', label: 'Repo Name', type: 'text'}],
        },
      })
      .afterClosed()
      .pipe(
        filter(form => !!form),
        tap(form => {
          repos[key].push(form.name);
          this.save();
        }),
      )
      .subscribe();
  }

  addCard(repos: Repos) {
    this.dialog
      .open(FormDialogComponent, {
        data: {
          title: '+User/Org',
          fields: [{name: 'name', label: 'User/Org', type: 'text'}],
        },
      })
      .afterClosed()
      .pipe(
        filter(form => !!form),
        tap(form => {
          repos[form.name] = [];
          this.save();
        }),
      )
      .subscribe();
  }

  deleteRepo(repos: string[], repo: string) {
    repos.splice(repos.indexOf(repo), 1);
    this.save();
  }

  deleteCard(repos: Repos, owner: string) {
    delete repos[owner];
    this.save();
  }

  save() {
    this.emitRepos();
    localStorage.setItem('repos', JSON.stringify(this._repos));
  }
}
