import {Component, Input, OnChanges, SimpleChanges, ViewChild, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';

import {Observable, from} from 'rxjs';
import {map, mergeAll, toArray, tap} from 'rxjs/operators';
import {addDays, startOfDay, differenceInDays, parseISO} from 'date-fns';
import {groupBy, flattenDeep, mapValues} from 'lodash-es';

import {ConfirmDialogComponent} from '../confirm/confirm-dialog/confirm-dialog.component';

const GitHubAppOAuthURL = 'https://github.com/login/oauth/authorize?client_id=bb333509e1fb0e20e1eb';

@Component({
  selector: 'recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css'],
})
export class RecentComponent implements OnChanges {
  @Input() repos: string[];
  @Input() sinceDaysAgo: number;

  @ViewChild('rateLimitError', {static: true})
  rateLimitErrorTemplate: TemplateRef<any>;

  @ViewChild('privateRepoError', {static: true})
  privateRepoErrorTemplate: TemplateRef<any>;

  groups: Observable<{[dayDiff: number]: {[repo: string]: object[]}}>;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnChanges(_changes: SimpleChanges) {
    this.load();
  }

  private load() {
    const since = startOfDay(addDays(new Date(), -this.sinceDaysAgo)).toISOString();

    this.groups = from(
      this.repos.map(repo =>
        this.http.get(`https://api.github.com/repos/${repo}/commits?since=${since}`).pipe(
          tap(
            () => {},
            error => {
              let template: TemplateRef<any>;
              switch (error.status) {
                case 403:
                  template = this.rateLimitErrorTemplate;
                  break;
                case 404:
                  template = this.privateRepoErrorTemplate;
                  break;
                default:
                  template = this.rateLimitErrorTemplate;
              }

              this.dialog
                .open(ConfirmDialogComponent, {
                  data: {
                    template,
                    context: {},
                  },
                })
                .afterClosed()
                .subscribe(confirm => {
                  if (confirm) {
                    window.location.href = GitHubAppOAuthURL;
                  }
                });
            },
          ),
          map((commits: any[]) => ({repo, commits})),
        ),
      ),
    ).pipe(
      mergeAll(),
      toArray(),
      map(data =>
        mapValues(
          groupBy(
            flattenDeep(data.map(({repo, commits}) => commits.map(data => ({repo, data})))),
            commit => differenceInDays(new Date(), parseISO(commit.data.commit.committer.date)),
          ),
          group => groupBy(group, commit => commit.repo),
        ),
      ),
    );
  }
}
