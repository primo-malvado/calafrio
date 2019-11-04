import React from 'react';
import { Mutation } from 'react-apollo';
 
import GET_LAUNCH from '../graphql/GET_LAUNCH.graphql';


import BOOK_TRIPS from '../graphql/BOOK_TRIPS.graphql';
 
 

export default function BookTrips({ cartItems }) {
  return (
    <Mutation
      mutation={BOOK_TRIPS}
      variables={{ launchIds: cartItems }}
      refetchQueries={cartItems.map(launchId => ({
        query: GET_LAUNCH,
        variables: { launchId },
      }))}
      update={cache => {
        cache.writeData({ data: { cartItems: [] } });
      }}
    >
      {(bookTrips, { data, loading, error }) =>
        data && data.bookTrips && !data.bookTrips.success ? (
          <p data-testid="message">{data.bookTrips.message}</p>
        ) : (
          <button onClick={bookTrips} data-testid="book-button">
            Book All
          </button>
        )
      }
    </Mutation>
  );
}
