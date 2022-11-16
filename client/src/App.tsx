import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Store } from './pages/Store';
import { UserForm } from './pages/UserForm';
import { Game } from './pages/Game';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="store/:type" element={<Store />} />
        <Route path="game" element={<Game/>} />
      </Route>
      <Route path="/public" element={<UserForm />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
};
