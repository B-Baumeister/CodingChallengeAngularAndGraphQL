# 🚀 SpaceX Launches Viewer - Angular Coding Challenge

This Angular web application is designed to display upcoming SpaceX rocket launches. Users can view a compact list of upcoming launches and expand entries to reveal detailed information. This project was developed as a coding challenge with the following objectives:

- Display a list of upcoming SpaceX rocket launches.
- Provide additional details for each launch upon expansion.
- Track and display the number of times each launch has been opened.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Code Structure](#code-structure)
5. [Tasks Implemented](#tasks-implemented)
6. [Technical Details](#technical-details)

---

## Project Overview

This application fetches data from the SpaceX GraphQL API and presents it in a user-friendly list. Users can expand each launch entry to view details like the mission name, rocket name, and launch time in the user's local timezone.

### Technology Stack

- **Angular**: Framework for building the UI.
- **Apollo Angular**: GraphQL client for managing API requests.
- **Angular Material**: Used for implementing UI components, such as the accordion for expandable launch details.

---

## Requirements

- **Node.js** (recommended version: v18.x or higher) and npm
- **Angular CLI** (version 18)
- **GraphQL and Apollo Client** (GraphQL queries)
- **Angular Material** (UI components like accordions and panels)
- **GraphQL Code Generator** (for automatic type and interface generation)

## Installation

### 1. Clone the project and install dependencies

```bash
git clone <Repository-URL>
cd <Project-Folder>
npm install
```

### 2. Set up Apollo Client and GraphQL Codegen

Ensure that the GraphQL Codegen configuration is set up correctly to automatically generate the types for GraphQL. The SpaceX API is accessed at the following URL:

https://spacex-production.up.railway.app/
The Codegen configuration and GraphQL query are defined in the codegen.yml file. Example of a Codegen configuration:

```bash
schema:
  - 'https://spacex-production.up.railway.app/'
documents: './src/**/*.graphql'
generates:
  ./src/app/generated/graphql.ts:
    plugins:
      - 'typescript'
      - 'typescript-operations'
      - 'typescript-apollo-angular'
```

Ensure that the automatically generated TypeScript files (e.g., **graphql.ts**) are correctly imported and used in your project.

### 3. Run the application

Start the application with the following command:

```bash
ng serve
```

By default, the application will be available at http://localhost:4200.

## Code Structure

### Usage

1. **Launch List**: View a list of upcoming SpaceX launches.
2. **Detailed View**: Click on any launch entry to view details like mission name, rocket name, and local launch time.
3. **Console Logging**: The number of times each launch has been opened is logged to the console to monitor user interaction.

## Tasks Implemented

### Story 1: List of Launches

- Display a compact list of upcoming SpaceX launches.
- Each entry shows the mission name, using data from the SpaceX GraphQL API.

### Story 2: Launch Details on Expansion

- Clicking on a launch entry expands it to reveal:
  - Rocket Name
  - Launch Time (displayed in the user’s local timezone)
- Only one entry can be expanded at a time for better UX, achieved through Angular Material's Accordion component.

### Story 3: Open Count Tracking

- Each launch entry records the number of times it has been opened.
- Data is stored in a key-value array where:
  - Key: Mission ID
  - Value: Number of times the entry was opened.
- This count is logged to the console whenever an entry is opened.

## Technical Details

### GraphQL Setup with Apollo Angular

The app fetches data from the SpaceX GraphQL API (https://spacex-production.up.railway.app/). The apollo-angular library is used to manage GraphQL queries within Angular.

#### GraphQL Query Example

```bash
query GetLaunches {
  launchesUpcoming {
    rocket {
      rocket_name
    }
    launch_date_utc
    mission_name
    launch_date_local
    mission_id
  }
}
```

#### Configuring Apollo Client

In graphql.module.ts, Apollo Client is configured to connect to the SpaceX API:

```bash
import { NgModule } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';

const uri = 'https://spacex-production.up.railway.app/';
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
```

### Component Details

#### ListOfLaunchesComponent

- **Template**: Displays the list of launches using Angular Material's accordion component.
- **Method trackOpenLaunches**: Logs each time a mission entry is opened, showing the mission ID and open count in the console.

```bash
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetLaunchesGQL } from '../services/spacexGraphql.service';

@Component({
  selector: 'app-list-of-launches',
  templateUrl: './list-of-launches.component.html',
  styleUrls: ['./list-of-launches.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfLaunchesComponent {
  loading = true;
  error: any;
  launchesUpcoming: any[] = [];
  futureLaunches$: Observable<any>;
  countOfOpenLaunches: { [missionId: string]: number } = {};

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
      `Mission ID: ${missionId} | Open Count: ${this.countOfOpenLaunches[missionId]}`
    );
  }
}
```

#### Template Example

```bash
<ng-container *ngIf="futureLaunches$ | async as futureLaunches">
  <mat-accordion>
    <mat-expansion-panel
      hideToggle
      *ngFor="let launch of futureLaunches"
      (opened)="trackOpenLaunches(launch)"
    >
      <mat-expansion-panel-header>
        <mat-panel-title>{{ launch.launch_date_utc | date }}</mat-panel-title>
        <mat-panel-description>{{ launch.mission_name }}</mat-panel-description>
      </mat-expansion-panel-header>
      <p>Rocket name: {{ launch.rocket.rocket_name }}</p>
      <p>
        Launch in your timezone: {{ launch.launch_date_local | date : "EEEE, MMMM d, y, h:mm a" }}
      </p>
    </mat-expansion-panel>
  </mat-accordion>
</ng-container>

```

### UI

The app uses Angular Material for the user interface, particularly the mat-accordion element, which allows users to expand launch details.

```bash
<mat-accordion>
  <mat-expansion-panel *ngFor="let launch of futureLaunches" (opened)="trackOpenLaunches(launch)">
    <mat-expansion-panel-header>
      <mat-panel-title>{{ launch.launch_date_utc | date }}</mat-panel-title>
      <mat-panel-description>{{ launch.mission_name }}</mat-panel-description>
    </mat-expansion-panel-header>
    <p>Rocket name: {{ launch.rocket.rocket_name }}</p>
    <p>Launch time: {{ launch.launch_date_local | date : "EEEE, MMMM d, y, h:mm a" }}</p>
  </mat-expansion-panel>
</mat-accordion>
```

### Open Frequency Tracking

The frequency of each launch entry being opened is tracked using a simple JavaScript object (**countOfOpenLaunches**). This frequency is logged to the console when a panel is opened:

```bash
trackOpenLaunches(launch: any) {
    const missionId = launch.mission_id;
    this.countOfOpenLaunches[missionId] = (this.countOfOpenLaunches[missionId] || 0) + 1;

    console.log(`Mission ${missionId} has been opened ${this.countOfOpenLaunches[missionId]} times`);
}
```

### Additional Notes

- **Codegen**: The project uses codegen to automatically generate TypeScript interfaces from the GraphQL schema, streamlining API integration.

This project meets the challenge requirements and demonstrates an effective use of Angular and Apollo Client for consuming and displaying GraphQL data.
