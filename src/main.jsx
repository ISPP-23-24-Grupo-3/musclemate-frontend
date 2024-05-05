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
import GymRoute from "./components/GymRoute";
import OwnerHomePage from "./views/OwnerHomePage/OwnerHomePage";
import GymHomePage from "./views/GymHomePage/GymHomePage";
import Users from "./views/UserListing/Users";
import Profile from "./views/UserListing/Profile";
import EquipmentList from "./views/Equipment/EquipmentList";
import EquipmentListClient from "./views/Equipment/EquipmentListClient";
import EquipmentForm from "./views/Equipment/EquipmentForm";
import EquipmentDetails from "./views/Equipment/EquipmentDetails";
import EquipmentDetailsClient from "./views/Equipment/EquipmentDetailsClient";
import { Routines } from "./views/Routines/Routines";
import { EditRoutine } from "./views/Routines/EditRoutine";
import Statistics from "./views/Statistics/StatisticsClient";
import TicketManagement from "./views/TicketManagement/TicketManagement";
import RegisterUser from "./views/RegisterPage/RegisterUser";
import ErrorPage from "./ErrorPage";
import ClientHomePage from "./views/ClientHomePage/ClientHomePage";
import AddTickets from "./views/Tickets/AddTickets";
import MyGymsOwner from "./views/Gyms/MyGymsOwner";
import EventList from "./views/EventsClasses/EventList";
import EventListClient from "./views/EventsClasses/EventListClient";
import EditWorkout from "./views/Workouts/EditWorkout";
import PricingPage from "./views/PricingPage/PricingPage";
import SubscriptionsPage from "./views/SubscriptionsPage/SubscriptionsPage";
import SuccessPage from "./views/SuccessPage";
import TermsConditions from "./views/Terms&Conditions/Terms&Conditions";
import MailVerification from "./views/VerificationPage/MailVerification";
import ProfileClient from "./views/UserListing/ProfileClient";
import AddEventsForm from "./views/EventsClasses/AddEvent";
import CreateGym from "./views/Gyms/CreateGym";
import GymDetails from "./views/Gyms/GymDetails";
import EventDetails from "./views/EventsClasses/EventDetails"
import ProfileOwner from "./views/ProfileOwner/ProfileOwner";
import GymStats from "./views/Gyms/GymStats";
import ProfileGym from "./views/ProfileOwner/ProfileGym";
import ReservationClient from "./views/Reservation/ReservationClient";
import TicketManagementUser from "./views/TicketManagement/TicektManagementUser";
import TicketDetail from "./views/TicketManagement/TicketDetail";
import AddTicketFromDetails from "./views/Tickets/AddTicketFromDetails";
import GymPremiumStats from "./views/GymHomePage/GymPremiumStats";

const ownerRoutes = [
  { path: "home", element: <OwnerHomePage />},
  { path: "users", element: <Users />},
  { path: "users/register", element: <RegisterUser />},
  { path: "users/:userId/profile", element: <Profile />},
  { path: "events", element: <EventList />},
  { path: "events/add", element: <AddEventsForm />},
  { path: "events/:eventId", element: <EventDetails />},
  { path: "equipments", element: <EquipmentList />},
  { path: "equipments/add", element: <EquipmentForm />},
  { path: "equipments/:equipmentId", element: <EquipmentDetails />},
  { path: "tickets", element: <TicketManagement />},
  { path: "my-gyms", element: <MyGymsOwner />},
  { path: "pricing", element: <PricingPage />},
  { path: "subscriptions", element: <SubscriptionsPage />},
  { path: "success", element: <SuccessPage />},
  { path: "gyms/add", element: <CreateGym />},
  { path: "gyms/:gymId", element: <GymDetails />},
  { path: "gyms/:gymId/stats", element: <GymStats />},
  { path: "profile", element: <ProfileOwner />},
];

const gymRoutes = [
  { path: "home", element: <GymHomePage />},
  { path: "users", element: <Users />},
  { path: "users/register", element: <RegisterUser />},
  { path: "users/:userId/profile", element: <Profile />},
  { path: "events", element: <EventList />},
  { path: "events/add", element: <AddEventsForm />},
  { path: "events/:eventId", element: <EventDetails />},
  { path: "equipments", element: <EquipmentList />},
  { path: "equipments/add", element: <EquipmentForm /> },
  { path: "equipments/:equipmentId", element: <EquipmentDetails />},
  { path: "tickets", element: <TicketManagement />},
  { path: "profile", element: <ProfileGym />},
  { path: "stats", element: <GymPremiumStats />},
];

const userRoutes = [
  { path: "home", element: <ClientHomePage /> },
  { path: "routines", element: <Routines /> },
  { path: "routines/add", element: <EditRoutine /> },
  { path: "routines/:id", element: <EditRoutine /> },
  { path: "statistics", element: <Statistics /> },
  { path: "equipments/:equipmentId", element: <EquipmentDetailsClient /> },
  { path: "add-tickets", element: <AddTickets /> },
  { path: "events", element: <EventListClient /> },
  { path: "reservations/:eventId", element: <ReservationClient />},
  { path: "routines/:routineId/workouts", element: <EditWorkout /> },
  { path: "profile", element: <ProfileClient /> },
  { path: "equipments", element: <EquipmentList /> },
  { path: "equipmentsClient", element: <EquipmentListClient /> },
  { path: "tickets", element: <TicketManagementUser /> },
  { path: "tickets/:ticketId", element: <TicketDetail />},
  { path: "equipments/:equipmentId/add-tickets", element: <AddTicketFromDetails /> },
];

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
        path: "/gym",
        element: <GymRoute />,
        children: gymRoutes,
      },
      {
        path: "/user",
        element: <UserRoute />,
        children: userRoutes,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/verify",
        element: <MailVerification />,
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
  </React.StrictMode>,
);
