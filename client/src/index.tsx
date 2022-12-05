import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import userReducer from './redux/user.reducer';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

//disable eslint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = createStore(userReducer as any);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          breakpoints: {
            xs: 500,
            sm: 800,
            md: 1000,
            lg: 1200,
            xl: 1400,
          },
        }}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </Provider>,
);
