import React from 'react';
 
import dog1 from '../assets/images/dog-1.png';
import dog2 from '../assets/images/dog-2.png';
import dog3 from '../assets/images/dog-3.png';

const max = 25; // 25 letters in the alphabet
const offset = 97; // letter A's charcode is 97
const avatars = [dog1, dog2, dog3];
const maxIndex = avatars.length - 1;
function pickAvatarByEmail(email) {
  const charCode = email.toLowerCase().charCodeAt(0) - offset;
  const percentile = Math.max(0, Math.min(max, charCode)) / max;
  return avatars[Math.round(maxIndex * percentile)];
}

export default function Header({ image, children = 'Space Explorer' }) {
  const email = atob(localStorage.getItem('token'));
  const avatar = image || pickAvatarByEmail(email);
  return (
    <div>
      <img src={avatar} alt="Space dog" />
      <div>
        <h2>{children}</h2>
        <h5>{email}</h5>
      </div>
    </div>
  );
}
 