import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfLaunchesComponent } from './list-of-launches/list-of-launches.component';

const routes: Routes = [
  {
    path: '',
    component: ListOfLaunchesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
