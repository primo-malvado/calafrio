import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

import PropTypes from 'prop-types';
// import { TranslateFunction } from '../../../../../i18n';
import { CardItem, CardText, CardSubtitleText, CardLabel, Button, primary } from '../../../../common/components/native';
/*
interface CardInfoViewProps {
  loading: boolean;
  creditCard: {
    expiryMonth: number;
    expiryYear: number;
    last4: string;
    brand: string;
  };
  t: TranslateFunction;
  navigation : any;
}
 */
const renderCardItem = (title /*: string*/, value /*: string*/) => (
  <CardItem style={styles.container}>
    <CardLabel style={styles.container}>{title}</CardLabel>
    <CardText style={styles.container}>{value}</CardText>
  </CardItem>
);

const CreditCardInfoView = ({ loading, t, creditCard, navigation } /*: CardInfoViewProps*/) => (
  <View style={styles.container}>
    {!loading &&
      creditCard &&
      creditCard.expiryMonth &&
      creditCard.expiryYear &&
      creditCard.last4 &&
      creditCard.brand && (
        <View>
          <CardSubtitleText style={styles.container}>{t('creditCard.title')}</CardSubtitleText>
          {renderCardItem(`${t('creditCard.text.card')}: `, `${creditCard.brand} ************${creditCard.last4}`)}
          {renderCardItem(`${t('creditCard.text.expires')}: `, `${creditCard.expiryMonth}/${creditCard.expiryYear}`)}
          <View>
            <View style={styles.buttonWrapper}>
              <Button color={primary} onPress={() => navigation.push('UpdateCreditCard')}>
                {t('update.btn')}
              </Button>
            </View>
          </View>
        </View>
      )}
  </View>
);

CreditCardInfoView.propTypes = {
  loading: PropTypes.bool,
  creditCard: PropTypes.shape({
    expiryMonth: PropTypes.number,
    expiryYear: PropTypes.number,
    last4: PropTypes.string,
    brand: PropTypes.string
  }),
  t: PropTypes.func,
  navigation: PropTypes.any
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonWrapper: {
    padding: 10
  }
});

export default withNavigation(CreditCardInfoView);
