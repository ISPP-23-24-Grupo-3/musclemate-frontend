import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './views/LoginPage/Login';
import Users from './views/UserListing/Users';
import './index.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import MachineList from "./views/MachineList/MachineList";
import MainLayout from "./views/MainLayout/MainLayout";
import { AuthProvider } from './utils/context/AuthContext';
import OwnerRoute from './components/OwnerRoute';
import UserRoute from './components/UserRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/",
        element: <AuthProvider />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/",
            element: <OwnerRoute />,
            children: [
              {
                path: "/my-machines",
                element: <MachineList />,
              },
            ],
          },
          {
            path: "/",
            element: <UserRoute />,
            children: [
              {
                path: "/users",
                element: <Users />,
              },
            ],
          }

        ]
      }
    ],
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Theme accentColor="green">
        <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>,
);
