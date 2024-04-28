import { Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useCallback, useContext, useEffect } from "react";
import AuthContext from "../../utils/context/AuthContext";
import SubscriptionContext from "../../utils/context/SubscriptionContext";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import HeaderLink from "./HeaderLink";

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);  
  const { getOwnerSubscription, ownerSubscription } = useContext(SubscriptionContext);

  useEffect(() => {
    getOwnerSubscription();
  }, []);

  const [open, setOpen] = useState(false);

    const handleMenu = useCallback(() => {
      setOpen(!open)
    }, [open])

  return (
    <header className="sticky top-0 shadow-md px-5 py-2 sm:px-10 bg-white font-sans min-h-[70px] z-10">
      <div className="flex justify-between max-lg:flex-wrap items-center gap-4 my-auto">
        <Link
          to={
            {
              owner: "/owner/home",
              client: "/user/home",
            }[user?.rol] || "/"
          }
        >
          <Flex align="center">
            <img
              src="/MuscleMateLogo.svg"
              alt="Logo"
              className="mr-4 size-14"
            />
            <h1 className="text-xl font-bold">MuscleMate</h1>
          </Flex>
        </Link>

        <button className={`lg:hidden`} onClick={handleMenu}>
          <IoMdMenu className="size-8" />
        </button>
        <ul
          className={`${
            open ? "max-lg:block" : "max-lg:hidden"
          } flex items-center max-lg:space-y-2 max-lg:w-full max-lg:mb-2`}
        >
          {user?.rol === "owner" ? (
            <>
              <HeaderLink to="/owner/my-gyms">Mis Gimnasios</HeaderLink>
              <HeaderLink to="/owner/equipments">Mis máquinas</HeaderLink>
              <HeaderLink to="/owner/users">Usuarios</HeaderLink>
              <HeaderLink to="/owner/tickets">Incidencias</HeaderLink>
              <HeaderLink to="/owner/events">Eventos</HeaderLink>
              <HeaderLink to="/owner/pricing">Planes</HeaderLink>
              <HeaderLink to="/owner/subscriptions">Subscripciones</HeaderLink>
            </>
          ) : user?.rol === "client" ? (
            <>
              <HeaderLink to="/user/routines">Rutinas</HeaderLink>
              <HeaderLink to="/user/statistics">Historial</HeaderLink>
              <HeaderLink to="/user/add-tickets">Crear incidencia</HeaderLink>
              <HeaderLink to="/user/equipmentsClient">
                Máquinas del gimnasio
              </HeaderLink>
              <HeaderLink to="/user/events">Eventos</HeaderLink>
              <HeaderLink to="user/tickets">Mis Incidencias</HeaderLink>
            </>
          ) : user?.rol === "gym" ? (
            <>
              <HeaderLink to="/gym/equipments">Mis máquinas</HeaderLink>
              <HeaderLink to="/gym/users">Usuarios</HeaderLink>
              <HeaderLink to="/gym/tickets">Incidencias</HeaderLink>
              <HeaderLink to="/gym/events">Eventos</HeaderLink>
              {ownerSubscription.owner_plan === "premium" ? (
                <HeaderLink to="/gym/stats">Estadísticas Globales</HeaderLink>
              ) : null}
            </>
          ) : null}
          {user ? (
            <>
              <li className="max-lg:py-2 px-3 flex gap-4 items-center">
                <Link
                  to={
                    user.rol === "client"
                      ? "/user/profile"
                      : user.rol === "gym"
                      ? "/gym/profile"
                      : "/owner/profile"
                  }
                >
                  <Button size="3" variant="surface" color="green">
                    {user.username}
                  </Button>
                </Link>
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
              </li>
            </>
          ) : (
            <li className="max-lg:py-2 px-3 flex gap-4 items-center">
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
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
