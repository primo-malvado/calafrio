import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import LaunchTile from '../components/launch-tile';
import Header from '../components/header';
import Loading from '../components/loading';


import GET_LAUNCHES from '../graphql/GET_LAUNCHES.graphql';

 



export default function Launches() {
  return (
    <Query query={GET_LAUNCHES}>
      {({ data, loading, error, fetchMore }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR</p>;

        return (
          <Fragment>
            <Header />
            <table>
              <tbody>
            {data.launches &&
              data.launches.launches &&
              data.launches.launches.map(launch => (
                <LaunchTile key={launch.id} launch={launch} />
              ))}
                </tbody>
              </table>
            {data.launches &&
              data.launches.hasMore && (
                <button
                  onClick={() =>
                    fetchMore({
                      variables: {
                        after: data.launches.cursor,
                      },
                      updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                        if (!fetchMoreResult) return prev;
                        return {
                          ...fetchMoreResult,
                          launches: {
                            ...fetchMoreResult.launches,
                            launches: [
                              ...prev.launches.launches,
                              ...fetchMoreResult.launches.launches,
                            ],
                          },
                        };
                      },
                    })
                  }
                >
                  Load More
                </button>
              )}
          </Fragment>
        );
      }}
    </Query>
  );
}
