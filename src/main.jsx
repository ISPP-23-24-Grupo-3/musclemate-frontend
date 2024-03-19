import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./views/LoginPage/Login";
import RegisterClient from "./views/RegisterPage/RegisterClient";
import App from "./App";
import MainLayout from "./views/MainLayout/MainLayout";
import { Theme } from "@radix-ui/themes";
import "./index.css";
import "@radix-ui/themes/styles.css";
import UserRoute from "./components/UserRoute";
import OwnerRoute from "./components/OwnerRoute";
import OwnerHomePage from "./views/OwnerHomePage/OwnerHomePage";
import Users from "./views/UserListing/Users";
import Profile from "./views/UserListing/Profile";
import EventList from "./views/EventsClasses/EventList";
import EquipmentList from "./views/Equipment/EquipmentList";
import EquipmentForm from "./views/Equipment/EquipmentForm";
import EquipmentDetails from "./views/Equipment/EquipmentDetails";
import { Routines } from "./views/Routines/Routines";
import { EditRoutine } from "./views/Routines/EditRoutine";
import TicketManagement from "./views/TicketManagement/TicketManagement";
import RegisterUser from "./views/RegisterPage/RegisterUser";
import ErrorPage from "./ErrorPage";
import ClientHomePage from "./views/ClientHomePage/ClientHomePage";
import AddTickets from "./views/Tickets/AddTickets";
import MyGymsOwner from "./views/Gyms/MyGymsOwner";

const ownerRoutes = [
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
    path: "equipments",
    element: <EquipmentList />,
  },
  {
    path: "equipments/add",
    element: <EquipmentForm />,
  },
  {
    path: "equipments/:equipmentId",
    element: <EquipmentDetails />,
  },
  {
    path: "tickets",
    element: <TicketManagement />,
  },
  {
    path: "my-gyms",
    element: <MyGymsOwner />,
  },
];

const userRoutes = [
  { path: "home", element: <ClientHomePage /> },
  { path: "routines", element: <Routines /> },
  { path: "routines/add", element: <EditRoutine /> },
  { path: "routines/:id", element: <EditRoutine /> },
  { path: "add-tickets", element: <AddTickets /> }, // Ruta dentro de UserRoute
];

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
                element: <RegisterClient/>,
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
                    path: "/equipment-details/:id",
                    element: <EquipmentDetails />,
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
                  { path: "/events/", element: <EventList /> },
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
