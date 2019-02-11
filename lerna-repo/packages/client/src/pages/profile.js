import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Header from '../components/header';
import Loading from '../components/loading';
import LaunchTile from '../components/launch-tile';


import { LAUNCH_TILE_DATA } from './launches';

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Profile() {
  return (
    <Query query={GET_MY_TRIPS} fetchPolicy="network-only">
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR: {error.message}</p>;

        return (
          <Fragment>
            <Header>My Trips</Header>
            {data.me.trips.length ? (
 
                <table>
                <tbody>
                  {data.me.trips.map(launch => (
                <LaunchTile key={launch.id} launch={launch} />
              ))}
                </tbody>
                </table>
 

            ) : (
              <p>You haven't booked any trips</p>
            )}
          </Fragment>
        );
      }}
    </Query>
  );
}
