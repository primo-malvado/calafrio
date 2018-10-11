import React from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
// import { TranslateFunction } from '../../../../../i18n';
import { Button, CardGroup, CardTitle, CardText } from '../../../../common/components/web';
/*
interface CardInfoViewProps {
  loading: boolean;
  creditCard: {
    expiryMonth: number,
    expiryYear: number,
    last4: string,
    brand: string
  };
  t: TranslateFunction;
}
*/
const CreditCardInfoView = ({ loading, t, creditCard } /*: CardInfoViewProps*/) => {
  return (
    <div>
      {!loading &&
        creditCard &&
        creditCard.expiryMonth &&
        creditCard.expiryYear &&
        creditCard.last4 &&
        creditCard.brand && (
          <CardGroup>
            <CardTitle>{t('creditCard.title')}</CardTitle>
            <CardText>
              {t('creditCard.text.card')}: {creditCard.brand} ************
              {creditCard.last4}
            </CardText>
            <CardText>
              {t('creditCard.text.expires')}: {creditCard.expiryMonth}/{creditCard.expiryYear}
            </CardText>
            <CardText>
              <Link to="/update-credit-card">
                <Button color="primary">{t('update.btn')}</Button>
              </Link>
            </CardText>
          </CardGroup>
        )}
    </div>
  );
};

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

export default CreditCardInfoView;
