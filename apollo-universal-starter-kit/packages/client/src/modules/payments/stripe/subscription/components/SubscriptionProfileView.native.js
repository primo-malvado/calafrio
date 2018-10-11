import React, { Fragment } from 'react';
import { StyleSheet, Text } from 'react-native';

import PropTypes from 'prop-types';
import { Card, CardSubtitleText } from '../../../../common/components/native';

import CreditCardInfo from '../containers/CreditCardInfo';
import CancelSubscription from '../containers/CancelSubscription';
// import { TranslateFunction } from '../../../../../i18n';
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
    return <Text>{t('loading')}</Text>;
  }

  return (
    <Fragment>
      <Card>
        <CardSubtitleText style={styles.title}>{t('subscriptionProfile.title')}</CardSubtitleText>
        {stripeSubscription && !stripeSubscription.active ? (
          <CardSubtitleText style={styles.container}>{t('subscriptionProfile.noSubscription')}</CardSubtitleText>
        ) : (
          <Fragment>
            <CreditCardInfo />
            <CancelSubscription />
          </Fragment>
        )}
      </Card>
    </Fragment>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20
  }
});
