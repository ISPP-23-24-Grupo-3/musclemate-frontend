import { Link, Navigate } from "react-router-dom";
import "./App.css";
import { Button, Flex } from "@radix-ui/themes";
import { useContext } from "react";
import AuthContext from "./utils/context/AuthContext";

function App() {

  const {user} = useContext(AuthContext)

  if(user?.rol === "owner"){
    return (
      <Navigate to="/owner/home" />
    )
  }
  if(user?.rol === "client"){
    return (
      <Navigate to="/user/home" />
    )
  }

  return (
    <>
      <Flex justify="center" align="center">
        <div className="mt-6 flex items-center">
          <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
          <h1 className="text-2xl font-bold">MuscleMate</h1>
        </div>
      </Flex>
      <Flex direction="column" justify="center" align="center">
        <Link to="/login">
          <Button size="4" variant="classic" color="green">
            Iniciar Sesión
          </Button>
        </Link>
      </Flex>
    </>
  );
}

export default App;
