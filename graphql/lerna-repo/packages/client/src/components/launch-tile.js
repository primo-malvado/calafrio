import React from 'react';

import { Link } from '@reach/router';

 
export default ({ launch }) => {
  const { id, mission, rocket } = launch;
  return (
    <tr>
      <td>{mission.name}</td>
      <td>{rocket.name}</td>
      <td>
    <Link
      to={`/launch/${id}`} >go</Link>

      </td>
    </tr>



  );
};
 