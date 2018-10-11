import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

import PropTypes from 'prop-types';
// import { TranslateFunction } from '../../../../../i18n';
import { LayoutCenter } from '../../../../common/components/index.web';
import settings from '../../../../../../../../settings';
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
    return <p>{t('loading')}</p>;
  }

  return (
    <Fragment>
      <Helmet title={`${settings.app.name} - ${t('subscriberPage.title')}`} />
      <LayoutCenter>
        <h1 className="text-center">{t('subscriberPage.title')}</h1>
      </LayoutCenter>
      <p>
        {t('subscriberPage.msg')} {subscriberNumber.number}.
      </p>
    </Fragment>
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
