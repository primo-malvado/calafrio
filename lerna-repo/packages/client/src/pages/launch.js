import React, { Fragment } from 'react';
import { Query } from 'react-apollo';


import Loading from '../components/loading';
import Header from '../components/header';
import LaunchDetail from '../components/launch-detail';
import ActionButton from '../containers/action-button';

import GET_LAUNCH_DETAILS from '../graphql/GET_LAUNCH_DETAILS.graphql'; 

export default function Launch({ launchId }) {
  return (
    <Query query={GET_LAUNCH_DETAILS} variables={{ launchId }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR: {error.message}</p>;

        return (
          <Fragment>
            <Header image={data.launch.mission.missionPatch}>
              {data.launch.mission.name}
            </Header>
            <LaunchDetail {...data.launch} />
            <ActionButton {...data.launch} />
          </Fragment>
        );
      }}
    </Query>
  );
}
