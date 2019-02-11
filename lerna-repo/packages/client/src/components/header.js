import React from 'react';
 

export default function Header({ image, children = 'Space Explorer' }) {
  const email = atob(localStorage.getItem('token'));
  return (
    <div>
      <div>
        <h2>{children}</h2>
        <h5>{email}</h5>
      </div>
    </div>
  );
}
 