/*eslint react/display-name: 0 */

import React from 'react';
import { Query } from 'react-apollo';
import SUBSCRIPTION_QUERY from '../graphql/SubscriptionQuery.graphql';

export const withStripeSubscription = Component => {
  return props => {
    return (
      <Query query={SUBSCRIPTION_QUERY} fetchPolicy="network-only">
        {({ loading, data: { stripeSubscription } }) => (
          <Component loading={loading} stripeSubscription={stripeSubscription} {...props} />
        )}
      </Query>
    );
  };
};

export default {};
