import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {BehaviorSubject} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {flatten} from 'lodash-es';

import {FormDialogComponent} from '../form-dialog/form-dialog.component';
import {HttpClient} from '@angular/common/http';

type Repos = {[owner: string]: string[]};
type GitHubResponse = {
  data: {
    repository: {issues: {totalCount: number}; pullRequests: {totalCount: number}};
  };
};

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
  repoInfo: {[owner: string]: {[repo: string]: GitHubResponse['data']['repository']}} = {};

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
    Object.entries(this._repos).forEach(([owner, repos]) => {
      if (!this.repoInfo[owner]) {
        this.repoInfo[owner] = {};
      }

      repos.forEach(repo => {
        if (this.repoInfo[owner][repo]) {
          return;
        }

        this.http
          .post('https://api.github.com/graphql', {
            query: `{
              repository(owner: "${owner}", name: "${repo}") {
                pullRequests(states: OPEN) {
                  totalCount
                }
                issues(states: OPEN) {
                  totalCount
                }
              }
            }`,
          })
          .subscribe(({data}: GitHubResponse) => {
            this.repoInfo[owner][repo] = data.repository;
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

  export() {
    navigator.clipboard.writeText(JSON.stringify(this._repos));
    alert('Copied repo data to clipboard!');
  }

  import() {
    const data = prompt('Repo data:');

    if (data) {
      Object.assign(this._repos, JSON.parse(data));
      this.save();
    }
  }
}
