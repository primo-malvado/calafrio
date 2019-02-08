import React from 'react';

import { Link } from '@reach/router';

import galaxy from '../assets/images/galaxy.jpg';
import iss from '../assets/images/iss.jpg';
import moon from '../assets/images/moon.jpg'; 


const backgrounds = [galaxy, iss, moon];
export function getBackgroundImage(id) {
  return `url(${backgrounds[Number(id) % backgrounds.length]})`;
}

export default ({ launch }) => {
  const { id, mission, rocket } = launch;
  return (
    <Link
      to={`/launch/${id}`}
      style={{
        backgroundImage: getBackgroundImage(id),
      }}
    >
      <h3>{mission.name}</h3>
      <h5>{rocket.name}</h5>
    </Link>
  );
};
 