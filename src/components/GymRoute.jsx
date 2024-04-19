import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../utils/context/AuthContext";

const GymRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.rol !== "gym") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default GymRoute;