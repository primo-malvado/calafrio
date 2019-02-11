import React from 'react';
 
import { Link } from '@reach/router';

import LogoutButton from '../containers/logout-button';
 
export default function Footer() {
  return (
    <footer>
      <div>
        <Link to="/"> 
          Home
        </Link>
        <Link to="/cart">
 
          Cart
        </Link>
        <Link to="/profile">
 
          Profile
        </Link>
        <LogoutButton />
      </div>
    </footer>
  );
}

 