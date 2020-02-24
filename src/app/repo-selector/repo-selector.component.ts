import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {BehaviorSubject} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {flatten} from 'lodash-es';

import {FormDialogComponent} from '../form-dialog/form-dialog.component';

type Repos = {[owner: string]: string[]};

@Component({
  selector: 'repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.scss'],
})
export class RepoSelectorComponent implements OnInit {
  _repos: Repos;

  repos = new BehaviorSubject<string[]>([]);

  private _showRepos: boolean;
  get showRepos() {
    return this._showRepos;
  }
  set showRepos(v: boolean) {
    this._showRepos = v;
    localStorage.setItem('showRepos', JSON.stringify(v));
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this._showRepos = JSON.parse(localStorage.getItem('showRepos') || 'true');

    let repos;

    if ((repos = localStorage.getItem('repos'))) {
      this._repos = JSON.parse(repos);
    } else {
      this._repos = {};
    }

    this.emitRepos(this._repos);
  }

  private emitRepos(repos: Repos) {
    this.repos.next(this.flattenRepos(repos));
  }

  private flattenRepos(repos: Repos) {
    return flatten(
      Object.keys(repos).map(owner =>
        repos[owner].map(repo => `${owner}/${repo}`),
      ),
    );
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
    this.emitRepos(this._repos);
    localStorage.setItem('repos', JSON.stringify(this._repos));
  }
}
