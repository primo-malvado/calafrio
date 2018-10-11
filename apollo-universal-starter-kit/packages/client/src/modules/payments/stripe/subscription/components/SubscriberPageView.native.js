import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PropTypes from 'prop-types';
// import { TranslateFunction } from '../../../../../i18n';
import { Card, CardSubtitleText } from '../../../../common/components/native';
/*
interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: {
    number: number
  };
  t: TranslateFunction;
}
*/
const SubscriberPageView = ({ loading, subscriberNumber, t } /*: SubscribersOnlyViewProps*/) => {
  if (loading) {
    return <Text>{t('loading')}</Text>;
  }

  return (
    <View style={styles.subscriberPageWrapper}>
      <Card>
        <CardSubtitleText style={styles.title}>{t('subscriberPage.title')}</CardSubtitleText>
        <CardSubtitleText style={{}}>{`${t('subscriberPage.msg')} ${subscriberNumber.number}.`}</CardSubtitleText>
      </Card>
    </View>
  );
};

SubscriberPageView.propTypes = {
  loading: PropTypes.bool,

  subscriberNumber: PropTypes.shape({
    number: PropTypes.number
  }),
  t: PropTypes.func
};
export default SubscriberPageView;

const styles = StyleSheet.create({
  subscriberPageWrapper: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
