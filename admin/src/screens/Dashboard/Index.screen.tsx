import React from 'react';
import { useDispatch } from 'react-redux';

import { DefaultScreen } from '../../components/Screen/DefaultScreen';
import { userGetProfileInfo } from '../../store/actions/user.action';

export const IndexScreen = () => {
 

  const dispatch = useDispatch();
      dispatch(userGetProfileInfo());
      
  return (
    <DefaultScreen title="Dashboard">
      <p>Dashboard here</p>
    </DefaultScreen>
  );
};
