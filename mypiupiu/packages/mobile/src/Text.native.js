
import * as React from 'react';
import { Text } from 'react-native';


interface IAppProps {
  children: any;
}

const MyText = (props: IAppProps) => {

  return (
    <Text>{props.children}</Text>
  );
};

export default MyText;
