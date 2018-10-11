import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { PageLayout } from '../../common/components/web';
import settings from '../../../../../../settings';
import translate from '../../../i18n';
import counters from '../counters';

/*
interface CounterProps {
  t: TranslateFunction;
}
*/

const Counter = ({ t }) => {
  return (
    <PageLayout>
      <Helmet
        title={`${settings.app.name} - ${t('title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('meta')}`
          }
        ]}
      />
      {counters.counterComponent.map((component /*: any*/, idx /*: number*/, items /*: any*/) =>
        React.cloneElement(component, { key: idx + items.length })
      )}
    </PageLayout>
  );
};

Counter.propTypes = {
  t: PropTypes.func
};

export default translate('counter')(Counter);
