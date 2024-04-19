import { Badge, Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../utils/context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <header className="shadow-md sm:px-10 bg-white font-sans min-h-[70px]">
      <div className="flex flex-wrap items-center gap-4">
        {user?.rol === "owner" ? (
          <Link to="/owner/home">
            <Flex align="center" className="md:m-4">
              <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
              <h1 className="text-xl font-bold">MuscleMate</h1>
            </Flex>
          </Link>
        ) : user?.rol === "client" ? (
          <Link to="/user/home">
            <Flex align="center" className="md:m-4">
              <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
              <h1 className="text-xl font-bold">MuscleMate</h1>
            </Flex>
          </Link>
        ) : (
          <Link to="/">
            <Flex align="center" className="md:m-4">
              <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
              <h1 className="text-xl font-bold">MuscleMate</h1>
            </Flex>
          </Link>
        )}
        <div className="flex ml-auto lg:order-1 gap-4 sm:mb-0 mb-4">
          {user ? (
            <>
              {user.rol === "client" ? (
                <Link to="user/profile">
                  <Button size="3" variant="surface" color="green">
                    {user.username}
                  </Button>
                </Link>
              ) : (
                <Link to="owner/profile">
                  <Button size="3" variant="surface" color="green">
                    {user.username}
                  </Button>
                </Link>
              )}

              <Link to="/">
                <Button
                  size="3"
                  variant="solid"
                  color="green"
                  onClick={logoutUser}
                >
                  Salir
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="2" variant="solid" color="green">
                  Entrar
                </Button>
              </Link>
              <Link to="/register-client">
                <Button size="2" variant="surface" color="green">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
          <button
            className={`lg:hidden ${user ? "" : "hidden"} ml-4 mr-4`}
            onClick={handleMenu}
          >
            <svg
              className="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <ul
          className={`${
            open ? "max-lg:block" : "max-lg:hidden"
          } flex lg:ml-12 lg:space-x-4 max-lg:space-y-2 max-lg:w-full`}
        >
          {user?.rol === "owner" ? (
            <>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/my-gyms"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Mis gimnasios
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/equipments"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Mis máquinas
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/users"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Usuarios
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/tickets"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Incidencias
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/events"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Eventos
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/pricing"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Planes
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/owner/subscriptions"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Subscripciones
                </Link>
              </li>
            </>
          ) : user?.rol === "client" ? (
            <>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/user/routines"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Rutinas
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/user/add-tickets"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Crear Incidencia
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/user/equipmentsClient"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Ver maquinas del gimnasio
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="/user/events"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Eventos
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
                <Link
                  to="user/tickets"
                  className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
                >
                  Mis Incidencias
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </header>
  );
};

export default Header;
