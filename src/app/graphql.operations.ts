import { gql } from 'apollo-angular';

export const GET_LAUNCHES = gql`
  query GetMisson {
    launchesUpcoming {
      rocket {
        rocket_name
      }
      launch_date_utc
      mission_name
      launch_date_local
    }
  }
`;
