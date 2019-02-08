import React from 'react';

import { getBackgroundImage } from './launch-tile';

const LaunchDetail = ({ id, site, rocket }) => (
  <div
    style={{
      backgroundImage: getBackgroundImage(id),
    }}
  >
    <h3>
      {rocket.name} ({rocket.type})
    </h3>
    <h5>{site}</h5>
  </div>
);

 

 
export default LaunchDetail;
