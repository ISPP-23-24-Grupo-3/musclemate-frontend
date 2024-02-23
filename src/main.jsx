import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './views/LoginPage/Login';
import './index.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme accentColor='green'>
    <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>
);
