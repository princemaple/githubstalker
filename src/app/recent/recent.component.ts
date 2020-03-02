import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';

import {Observable, from} from 'rxjs';
import {
  map,
  switchMap,
  mergeAll,
  toArray,
  catchError,
  tap,
} from 'rxjs/operators';
import {
  addDays,
  startOfDay,
  format,
  differenceInDays,
  parseISO,
} from 'date-fns';
import {groupBy, flattenDeep, mapValues} from 'lodash-es';

import {ConfirmDialogComponent} from '../confirm/confirm-dialog/confirm-dialog.component';

const GitHubAppOAuthURL =
  'https://github.com/login/oauth/authorize?client_id=bb333509e1fb0e20e1eb';

@Component({
  selector: 'recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css'],
})
export class RecentComponent implements OnChanges {
  @Input() token: string;
  @Input() repos: string[];
  @Input() sinceDaysAgo: number;

  @ViewChild('rateLimitError', {static: true})
  rateLimitErrorTemplate: TemplateRef<any>;

  groups: Observable<{[dayDiff: number]: {[repo: string]: object[]}}>;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    this.load();
  }

  private options(token: string) {
    if (token) {
      return {headers: {Authorization: `token ${token}`}};
    }
    return {};
  }

  private load() {
    const since = startOfDay(
      addDays(new Date(), -this.sinceDaysAgo),
    ).toISOString();

    this.groups = from(
      this.repos.map(repo =>
        this.http
          .get(
            `https://api.github.com/repos/${repo}/commits?since=${since}`,
            this.options(this.token),
          )
          .pipe(
            tap(
              () => {},
              error => {
                if (error.status === 403) {
                  this.dialog
                    .open(ConfirmDialogComponent, {
                      data: {
                        template: this.rateLimitErrorTemplate,
                        context: {},
                      },
                    })
                    .afterClosed()
                    .subscribe(confirm => {
                      if (confirm) {
                        window.location.href = GitHubAppOAuthURL;
                      }
                    });
                }
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
            flattenDeep(
              data.map(({repo, commits}) =>
                commits.map(data => ({repo, data})),
              ),
            ),
            commit =>
              differenceInDays(
                new Date(),
                parseISO(commit.data.commit.committer.date),
              ),
          ),
          group => groupBy(group, commit => commit.repo),
        ),
      ),
    );
  }
}
