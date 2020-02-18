import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, from} from 'rxjs';
import {map, switchMap, mergeAll, toArray} from 'rxjs/operators';
import {addDays, format, differenceInDays, parseISO} from 'date-fns';
import {groupBy, flattenDeep, mapValues} from 'lodash-es';

@Component({
  selector: 'recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css'],
})
export class RecentComponent implements OnChanges {
  @Input() token: string;
  @Input() repos: string[];
  @Input() sinceDaysAgo: number;

  groups: Observable<any>;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  private options(token: string) {
    if (token) {
      return {headers: {Authorization: `token ${token}`}};
    }
    return {};
  }

  private init() {
    const since = addDays(new Date(), -this.sinceDaysAgo || -7).toISOString();

    this.groups = from(
      this.repos.map(repo =>
        this.http
          .get(
            `https://api.github.com/repos/${repo}/commits?since=${since}`,
            this.options(this.token),
          )
          .pipe(map((commits: any[]) => ({repo, commits}))),
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
            entry =>
              differenceInDays(
                new Date(),
                parseISO(entry.data.commit.committer.date),
              ),
          ),
          group => groupBy(group, entry => entry.repo),
        ),
      ),
    );
  }
}
