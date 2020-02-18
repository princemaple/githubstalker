import { Component, Input, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';

import {BehaviorSubject} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {flatten} from 'lodash-es';

import {FormDialogComponent} from '../form-dialog/form-dialog.component';

const Repos: {[owner: string]: string[]} = {
  angular: ['angular', 'material2'],
  Eugeny: ['terminus'],
  docker: ['compose', 'machine'],
  'elixir-lang': ['elixir'],
  phoenixframework: ['phoenix'],
};

@Component({
  selector: 'repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.css']
})
export class RepoSelectorComponent implements OnInit {
  _repos: any;

  repos = new BehaviorSubject<string[]>([]);

  constructor(private dialog: MatDialog) {}
  
  ngOnInit() {
    let repos;
    if (repos = localStorage.getItem('repos')) {
      this._repos = JSON.parse(repos);
      
    } else {
      this._repos = {};
    }
    this.emitRepos(this._repos);
  }

  private emitRepos(repos) {
    this.repos.next(this.flattenRepos(repos));
  }

  private flattenRepos(repos) {
    return flatten(
      Object.keys(repos).map(owner =>
        repos[owner].map(repo => `${owner}/${repo}`),
      ),
    );
  }

  addRepo(store, key) {
    this.dialog.open(FormDialogComponent, {data: {title: 'New Repo', fields: [{name: 'name', label: 'Repo Name', type: 'text'}]}}).afterClosed().pipe(
      filter(form => !!form),
      tap(form => {
        store[key].push(form.name);
        this.save();
      })
    ).subscribe();
  }

  addCard(store) {
    this.dialog.open(FormDialogComponent, {data: {title: 'New Card', fields: [{name: 'name', label: 'User/Org', type: 'text'}]}}).afterClosed().pipe(
      filter(form => !!form),
      tap(form => {
        store[form.name] = [];
        this.save();
      })
    ).subscribe();
  }

  deleteRepo(repos: string[], repo: string) {
    repos.splice(repos.indexOf(repo), 1);
    this.save();
  }

  deleteCard(store: any, owner: string) {
    delete store[owner];
    this.save();
  }

  save() {
    this.emitRepos(this._repos);
    localStorage.setItem('repos', JSON.stringify(this._repos));
  }
}