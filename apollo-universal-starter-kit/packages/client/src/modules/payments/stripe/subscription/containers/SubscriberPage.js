import React from 'react';
import { Query } from 'react-apollo';

import PropTypes from 'prop-types';
import SubscriberPageView from '../components/SubscriberPageView';
import translate /*, { TranslateFunction }*/ from '../../../../../i18n';

import SUBSCRIBER_NUMBER_QUERY from '../graphql/SubscriptionProtectedNumberQuery.graphql';

const SubscriberPage = ({ t } /*: { t: TranslateFunction }*/) => (
  <Query query={SUBSCRIBER_NUMBER_QUERY} fetchPolicy="network-only">
    {({ loading, data }) => (
      <SubscriberPageView loading={loading} t={t} subscriberNumber={data.stripeSubscriptionProtectedNumber} />
    )}
  </Query>
);

SubscriberPage.propTypes = {
  t: PropTypes.func
};

export default translate('stripeSubscription')(SubscriberPage);
