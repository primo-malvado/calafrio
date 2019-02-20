import React from 'react';
import { Query } from 'react-apollo';
 
import LaunchTile from '../components/launch-tile';
import GET_LAUNCH from '../graphql/GET_LAUNCH.graphql';




export default function CartItem({ launchId }) {
  return (
    <Query query={GET_LAUNCH} variables={{ launchId }}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR: {error.message}</p>;
        return data && <LaunchTile launch={data.launch} />;
      }}
    </Query>
  );
}
