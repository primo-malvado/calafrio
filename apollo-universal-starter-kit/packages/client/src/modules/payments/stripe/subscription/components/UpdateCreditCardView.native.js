import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import SubscriptionCardForm from './SubscriptionCardFormView';

const UpdateCreditCardView = (props /*: UpdateCardViewProps*/) => {
  const { t } = props;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.cardFormWrapper}>
          <SubscriptionCardForm {...props} buttonName={t('update.btn')} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  textWrapper: {
    margin: 10
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center'
  },
  cardFormWrapper: {
    padding: 10,
    margin: 10
  }
});

export default UpdateCreditCardView;
