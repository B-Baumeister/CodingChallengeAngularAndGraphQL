import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_LAUNCHES } from '../graphql.operations';

@Component({
  selector: 'app-list-of-launches',
  templateUrl: './list-of-launches.component.html',
  styleUrl: './list-of-launches.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ListOfLaunchesComponent implements OnInit {
  readonly panelOpenState = signal(false);
  loading = true;
  error: any;
  launchesUpcoming: any[] = [];

  constructor(private readonly apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<any>({
        query: GET_LAUNCHES,
        pollInterval: 500,
      })
      .valueChanges.subscribe(
        (result: any) => {
          console.log(result.data?.launchesUpcoming);
          this.launchesUpcoming = result.data?.launchesUpcoming || [];
          this.loading = result.loading;
        },
        (error) => {
          console.error('Apollo Error:', error);
          this.error = error;
          this.loading = false;
        }
      );
  }
}
