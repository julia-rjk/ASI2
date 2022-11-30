import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Game } from './components/Game';
import { Buy } from './pages/Buy';
import { Home } from './pages/Home';
import { Sell } from './pages/Sell';
import { UserForm } from './pages/UserForm';
import { GameHome } from './pages/GameHome';
import { PrivateRoute } from './components/PrivateRoute';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="game" element={<GameHome />} />
        <Route path="game/play" element={<Game />} />
        <Route path="store/buy" element={<Buy />} />
        <Route path="store/sell" element={<Sell />} />
      </Route>
      <Route path="/public" element={<UserForm />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
};
