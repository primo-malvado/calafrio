import React, { Fragment } from 'react';
 
 
export default function PageContainer(props) {
  return (
    <Fragment> 
      <div>{props.children}</div>
    </Fragment>
  );
}
 