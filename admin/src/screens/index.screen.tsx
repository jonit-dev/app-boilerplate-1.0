import React from 'react';
import { Link } from 'react-router-dom';

export const IndexScreen = () => {
  return (
    <div>
      <p>
        [INDEX SCREEN]
        <Link to="/about">About us</Link>
      </p>
    </div>
  );
};
