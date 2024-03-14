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
import AddTickets from "./views/Tickets/AddTickets"; // Importa la vista AddTickets


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
            path: "/",
            element: <OwnerRoute />,
            children: [
              {
                path: "/register-user",
                element: <RegisterUser />,
              },
              {
                path: "/my-machines",
                element: <MachineList />,
              },
              {
                path: "/add-machine",
                element: <GymMachineForm />,
              },
              {
                path: "/",
                element: <OwnerRoute />,
                children: [
                  {
                    path: "/register-user",
                    element: <RegisterUser />,
                  },
                  {
                    path: "/my-machines",
                    element: <MachineList />,
                  },
                  {
                    path: "/add-machine",
                    element: <GymMachineForm/>,
                  },
                  {
                    path: "/users",
                    element: <Users />,
                  },
                  {
                    path: "/owner-home",
                    element: <OwnerHomePage />,
                  },
                  {
                    path: "/equipment-details/:equipmentId",
                    element: <EquipmentDetails />,
                  },
                ],
              },
              {
                path: "/tickets",
                element: <TicketManagement />,
              },
              {
                path: "/owner-home",
                element: <OwnerHomePage />,
              },
              {
                path: "/equipment-details/:id",
                element: <EquipmentDetails />,
              },
            ],
          },
          {
            path: "/",
            element: <UserRoute />,
            children: [
              { path: "/routines/:id", element: <EditRoutine /> },
              { path: "/routines/new", element: <EditRoutine /> },
              { path: "/routines/", element: <Routines /> },
              { path: "/add-tickets", element: <AddTickets /> }, // Ruta dentro de UserRoute

            ],
          },
          {
            path: "/equipment-details/:id",
            element: <EquipmentDetails />,
          },
          {
            path: "/users/:userId/profile",
            element: <Profile />,
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
          { path: "/add-tickets", element: <AddTickets /> }, // Ruta dentro de UserRoute
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
