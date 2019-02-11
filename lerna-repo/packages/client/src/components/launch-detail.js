import React from 'react';

const LaunchDetail = ({ id, site, rocket }) => (
  <div>
    <h3>
      {rocket.name} ({rocket.type})
    </h3>
    <h5>{site}</h5>
  </div>
);

 

 
export default LaunchDetail;
