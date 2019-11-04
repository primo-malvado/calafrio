import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
 
import Header from '../components/header';
import Loading from '../components/loading';

import CartItem from '../containers/cart-item';
import BookTrips from '../containers/book-trips';



import GET_CART_ITEMS from '../graphql/GET_CART_ITEMS.graphql';

 
export default function Cart() {
  return (
    <Query query={GET_CART_ITEMS}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR: {error.message}</p>;
        return (
          <Fragment>
            <Header>My Cart</Header>
            {!data.cartItems || !data.cartItems.length ? (
              <p data-testid="empty-message">No items in your cart</p>
            ) : (
          <Fragment>
              <table>
                <tbody>
                {data.cartItems.map(launchId => (
                  <CartItem key={launchId} launchId={launchId} />
                ))}
                </tbody>
                </table>
                <BookTrips cartItems={data.cartItems} />
          </Fragment>
            )}
          </Fragment>
        );
      }}
    </Query>
  );
}
