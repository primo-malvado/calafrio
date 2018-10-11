import React from 'react';
import styled from 'styled-components';

import PropTypes from 'prop-types';
import { Button } from '../../../common/components/web';

const Section = styled.section`
  margin-bottom: 30px;
  text-align: center;
`;

const ClientCounterView = ({ text, children }) => (
  <Section>
    <p>{text}</p>
    {children}
  </Section>
);

ClientCounterView.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node
};

const ClientCounterButton = ({ onClick, text } /*: ButtonProps*/) => (
  <Button id="apollo-link-button" color="primary" onClick={onClick}>
    {text}
  </Button>
);

ClientCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};

export { ClientCounterButton, ClientCounterView };
