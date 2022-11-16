import React from 'react';
import {
    AppShell,
    Header,
    Group,
    Text,
    Avatar,
    Title,
    Menu,
} from '@mantine/core';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/user.selector';
import { CurrencyDollar, Home, Logout } from 'tabler-icons-react';
import { setUser } from '../redux/user.action';

export const Chat = () => {
    const pathName = useLocation().pathname;
    const title = useMenu().find((item) => pathName === item.path)?.name;
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    if (!!!user) {
        return <Navigate to="/public" />;
    }

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1><i className="fas fa-kiwi-bird"></i> Chat </h1>
            </header>
            <div className="form-control">

            <label htmlFor="availableUsers">Utilisateur disponible</label>
            <select name="availableUsers" id="availableUsers">
            </select>

            </div>
            <main className="chat-main">
                <div className="chat-sidebar">
                    <h2 id="room-name"></h2>
                    <h3><i className="fas fa-user"></i> Online</h3>
                    <ul id="users">
                    </ul>
                </div>
                <div className="chat-messages">
                </div>
            </main>

            <div className="chat-form-container">
                <form id="chat-form">
                    <input
                        id="msg"
                        type="text"
                        placeholder="Type a Message"
                        required
                    />
                    <button className="btn-plane"><i className="fas fa-paper-plane"></i> </button>
                </form>
            </div>

            <div className="chat-form-container">
                <form id="chat-form-broadcast">
                    <input
                        id="msg"
                        type="text"
                        placeholder="Envoyer à tout le monde"
                        required/>
                    <button className="btn-plane"><i className="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    );
};
