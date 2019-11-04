import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import Header from '../components/header';
import Loading from '../components/loading';
import LaunchTile from '../components/launch-tile';


import GET_MY_TRIPS from '../graphql/GET_MY_TRIPS.graphql';




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
