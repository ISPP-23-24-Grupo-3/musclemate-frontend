import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./views/LoginPage/Login";
import RegisterClient from "./views/RegisterPage/RegisterClient";
import App from "./App";
import MainLayout from "./views/MainLayout/MainLayout";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./index.css";
import UserRoute from "./components/UserRoute";
import OwnerRoute from "./components/OwnerRoute";
import OwnerHomePage from "./views/OwnerHomePage/OwnerHomePage";
import Users from "./views/UserListing/Users";
import Profile from "./views/UserListing/Profile";
import EquipmentList from "./views/Equipment/EquipmentList";
import EquipmentForm from "./views/Equipment/EquipmentForm";
import EquipmentDetails from "./views/Equipment/EquipmentDetails";
import { Routines } from "./views/Routines/Routines";
import { EditRoutine } from "./views/Routines/EditRoutine";
import TicketManagement from "./views/TicketManagement/TicketManagement";
import RegisterUser from "./views/RegisterPage/RegisterUser";
import ErrorPage from "./ErrorPage";

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
];

const userRoutes = [
  { path: "routines", element: <Routines /> },
  { path: "routines/add", element: <EditRoutine /> },
  { path: "routines/:id", element: <EditRoutine /> },
];

const router = createBrowserRouter([
  {
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
        path: "/owner",
        element: <OwnerRoute />,
        children: ownerRoutes,
      },
      {
        path: "/user",
        element: <UserRoute />,
        children: userRoutes,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Theme accentColor="green">
      <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>
);
