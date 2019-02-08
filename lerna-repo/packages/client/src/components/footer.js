import React from 'react';
 
import MenuItem from './menu-item';
import LogoutButton from '../containers/logout-button';
 
export default function Footer() {
  return (
    <footer>
      <div>
        <MenuItem to="/"> 
          Home
        </MenuItem>
        <MenuItem to="/cart">
 
          Cart
        </MenuItem>
        <MenuItem to="/profile">
 
          Profile
        </MenuItem>
        <LogoutButton />
      </div>
    </footer>
  );
}

 