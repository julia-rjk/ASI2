import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../redux/user.selector';
import { Layout } from './Layout';

export const PrivateRoute = () => {
  const user = useSelector(selectUser);
  if (!!!user) {
    return <Navigate to="/public" />;
  }
  return <Layout />;
};
