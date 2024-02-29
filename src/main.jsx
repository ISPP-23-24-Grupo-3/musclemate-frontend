import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/LoginPage/Login";
import { Routines } from "./views/Routines/Routines";

import RegisterUser from "./views/RegisterPage/RegisterUser";
import RegisterClient from "./views/RegisterPage/RegisterClient";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import App from "./App";
import Users from "./views/UserListing/Users";
import "@radix-ui/themes/styles.css";
import MachineList from "./views/MachineList/MachineList";
import MainLayout from "./views/MainLayout/MainLayout";
import { EditRoutine } from "./views/Routines/EditRoutine";
import { AuthProvider } from "./utils/context/AuthContext";
import OwnerRoute from "./components/OwnerRoute";
import UserRoute from "./components/UserRoute";

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
        path: "/register",
        element: <RegisterUser />,
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
              {
                path: "/register-client",
                element: <RegisterClient />,
              },
              {
                path: "/users",
                element: <Users />,
              },
            ],
          },
          {
            path: "/",
            element: <UserRoute />,
            children: [
              { path: "/routines/:id/edit", element: <EditRoutine /> },
              { path: "/routines/new", element: <EditRoutine /> },
              { path: "/routines/", element: <Routines /> },
            ],
          },
        ],
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
