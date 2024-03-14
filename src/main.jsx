import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/LoginPage/Login";
import { Routines } from "./views/Routines/Routines";

import RegisterUser from "./views/RegisterPage/RegisterUser";
import RegisterClient from "./views/RegisterPage/RegisterClient";
import GymMachineForm from "./views/MachineList/AddMachine";
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
import OwnerHomePage from "./views/OwnerHomePage/OwnerHomePage";
import EquipmentDetails from "./views/EquipmentDetails/EquipmentDetails";

import TicketManagement from "./views/TicketManagement/TicketManagement";

import Profile from "./views/UserListing/Profile";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <App />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register-client",
            element: <RegisterClient />,
          },
          {
            path: "owner",
            element: <OwnerRoute />,
            children: [
              {
                path: "home",
                element: <OwnerHomePage />,
              },
              {
                path: "users",
                element: <Users />,
              },
              {
                path: "users/register",
                element: <RegisterUser />,
              },
              {
                path: "users/:userId/profile",
                element: <Profile />,
              },
              {
                path: "machines",
                element: <MachineList />,
              },
              {
                path: "machines/add",
                element: <GymMachineForm />,
              },
              {
                path: "equipments/:id",
                elemment: <EquipmentDetails />,
              },
            ],
          },
          {
            path: "user",
            element: <UserRoute />,
            children: [
              { path: "routines", element: <Routines /> },
              { path: "routines/new", element: <EditRoutine /> },
              { path: "routines/:id", element: <EditRoutine /> },
              {
                path: "tickets",
                element: <TicketManagement />,
              },
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
  </React.StrictMode>
);
