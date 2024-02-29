
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/LoginPage/Login";
import RegisterUser from "./views/RegisterPage/RegisterUser";
import RegisterClient from "./views/RegisterPage/RegisterClient";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import App from './App';
import Users from './views/UserListing/Users';
import '@radix-ui/themes/styles.css';
import MachineList from "./views/MachineList/MachineList";
import MainLayout from "./views/MainLayout/MainLayout";
import EquipmentDetails from "./views/EquipmentDetails/EquipmentDetails";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Place your routes here
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <RegisterUser />,
      },
      {
        path: "/register-client",
        element: <RegisterClient />,
      },
      {
        path: "/my-machines",
        element: <MachineList />,
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: "/equipment-details/:serialNumber",
        element: <EquipmentDetails />,
      },
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
