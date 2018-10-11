import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import CreditCardInfo from '../containers/CreditCardInfo';
import CancelSubscription from '../containers/CancelSubscription';
import { CardGroup, CardText, CardTitle } from '../../../../common/components/web';
/*
interface SubscriptionProfileViewProps {
  loading: boolean;
  stripeSubscription: {
    active: boolean
  };
  t: TranslateFunction;
}
*/
const SubscriptionProfileView = ({ t, loading, stripeSubscription } /*: SubscriptionProfileViewProps*/) => {
  if (loading) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div style={{ border: '1px solid black' }}>
      <CardGroup>
        <CardTitle>{t('subscriptionProfile.title')}</CardTitle>
      </CardGroup>
      {stripeSubscription && !stripeSubscription.active ? (
        <CardGroup>
          <CardText>{t('subscriptionProfile.noSubscription')}</CardText>
        </CardGroup>
      ) : (
        <Fragment>
          <CreditCardInfo />
          <CancelSubscription />
        </Fragment>
      )}
    </div>
  );
};
SubscriptionProfileView.propTypes = {
  loading: PropTypes.bool,
  stripeSubscription: PropTypes.shape({
    active: PropTypes.bool
  }),
  t: PropTypes.func
};

export default SubscriptionProfileView;
