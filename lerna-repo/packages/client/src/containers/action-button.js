import React from 'react';
import { Mutation } from 'react-apollo';
 
import GET_LAUNCH_DETAILS from '../graphql/GET_LAUNCH_DETAILS.graphql'; 
import CANCEL_TRIP from '../graphql/CANCEL_TRIP.graphql'; 
import TOGGLE_CART from '../graphql/TOGGLE_CART.graphql'; 
 

export default function ActionButton({ isBooked, id, isInCart }) {
  return (
    <Mutation
      mutation={isBooked ? CANCEL_TRIP : TOGGLE_CART}
      variables={{ launchId: id }}
      refetchQueries={[
        {
          query: GET_LAUNCH_DETAILS,
          variables: { launchId: id },
        },
      ]}
    >
      {(mutate, { loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>An error occurred</p>;

              //isBooked={isBooked}
        return (
          <div>
            <button
              onClick={mutate}
              data-testid={'action-button'}
            >
              {isBooked
                ? 'Cancel This Trip'
                : isInCart
                  ? 'Remove from Cart'
                  : 'Add to Cart'}
            </button>
          </div>
        );
      }}
    </Mutation>
  );
}
