import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { Buy } from './pages/Buy';
import { Home } from './pages/Home';
import { Sell } from './pages/Sell';
import { UserForm } from './pages/UserForm';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="store/buy" element={<Buy />} />
        <Route path="store/sell" element={<Sell />} />
        <Route path="game" element={<div> COMING SOON!!! </div>} />
      </Route>
      <Route path="/public" element={<UserForm />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
};
