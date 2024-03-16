import { Link, Navigate } from "react-router-dom";
import "./App.css";
import { Button, Flex } from "@radix-ui/themes";
import { useContext } from "react";
import AuthContext from "./utils/context/AuthContext";
import { IoBarbell, IoStatsChart, IoTicket } from "react-icons/io5";


function App() {

  const {user} = useContext(AuthContext)

  if(user?.rol === "owner") {
    return <Navigate to="/owner/home" />
  } else if(user?.rol === "client") {
    return <Navigate to="/user/home" />
  } else {
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
        <div className="md:mt-8 m-5 grid grid-row-3 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <IoStatsChart className="h-16 w-16 text-gray-700" />
                <span className="mt-2 text-lg font-semibold">Tendencias de Entrenamiento</span>
                <p className="text-center text-sm text-gray-600 mt-1">
                  Sigue tu progreso y observa las tendencias de tu entrenamiento a lo largo del tiempo.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <IoTicket className="h-16 w-16 text-gray-700" />
                <span className="mt-2 text-lg font-semibold">Envío de Quejas</span>
                <p className="text-center text-sm text-gray-600 mt-1">
                Reporta cualquier problema con las máquinas del gimnasio para una rápida resolución.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <IoBarbell className="h-16 w-16 text-gray-700" />
                <span className="mt-2 text-lg font-semibold">Gestión de Clientes y Máquinas</span>
                <p className="text-center text-sm text-gray-600 mt-1">
                  Si eres propietario de un gimnasio, registrate y administra la información de los clientes y el estado y uso de las máquinas del gimnasio.
                </p>
              </div>
            </div>
      </Flex>
    </>
  );
  }
}

export default App;
