import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PropTypes from 'prop-types';
import { Button, primary } from '../../../common/components/native';
/*
interface ViewProps {
  text: string;
  children: any;
}
*/
export const ClientCounterView = ({ text, children } /*: ViewProps*/) => (
  <View>
    <View style={styles.element}>
      <Text style={styles.box}>{text}</Text>
    </View>
    {children}
  </View>
);

ClientCounterView.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string
};

const styles = StyleSheet.create({
  element: {
    paddingTop: 30
  },
  box: {
    textAlign: 'center',
    marginBottom: 5
  }
});

/*
interface ButtonProps {
  onClick: () => any;
  text: string;
}
*/
export const ClientCounterButton = ({ onClick, text } /*: ButtonProps*/) => (
  <Button type={primary} onPress={onClick}>
    {text}
  </Button>
);

ClientCounterButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
};

export default ClientCounterView;
