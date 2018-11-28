
import * as React from 'react';
 

interface IAppProps {
  children: any;
}

const MyText = (props: IAppProps) => {

  return (
    <h2>{props.children}</h2>
  );
};

export default MyText;
