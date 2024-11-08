import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetLaunchesGQL } from '../services/spacexGraphql.service';
@Component({
  selector: 'app-list-of-launches',
  templateUrl: './list-of-launches.component.html',
  styleUrl: './list-of-launches.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfLaunchesComponent {
  readonly panelOpenState = signal(false);
  loading = true;
  error: any;
  launchesUpcoming: any[] = [];

  futureLaunches$: Observable<any>;

  countOfOpenLaunches: { [missioId: string]: number } = {};

  constructor(private readonly getfutureLaunchesService: GetLaunchesGQL) {
    this.futureLaunches$ = this.getfutureLaunchesService
      .fetch()
      .pipe(map((result) => result.data.launchesUpcoming));
  }

  trackOpenLaunches(launch: any) {
    const missionId = launch.mission_id;
    this.countOfOpenLaunches[missionId] =
      (this.countOfOpenLaunches[missionId] || 0) + 1;
    console.log(
      `Key(respective mission ID): ${missionId} | Value(Number of times this mission has already been opened): ${this.countOfOpenLaunches[missionId]}`
    );
  }
}
