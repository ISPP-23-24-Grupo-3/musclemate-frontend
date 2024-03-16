import { Badge, Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../utils/context/AuthContext";

const Header = () => {

    const {user, logoutUser} = useContext(AuthContext)
    return (
        <header className="flex flex-col md:flex-row items-center justify-between border-b-2 border-black">
            <div className="flex flex-col md:flex-row items-center justify-between">
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
            <div className="flex flex-col mb-3 md:mb-0 md:flex-row gap-5 md:gap-10 items-center md:ml-3">
                {user?.rol === "owner" ? (
                    <>
                    <Link to="/owner/equipments">
                        <Button size="4" variant="ghost" color="green">
                            Mis máquinas
                        </Button>
                    </Link>
                    <Link to="/owner/users">
                        <Button size="4" variant="ghost" color="green">
                            Usuarios
                        </Button>
                    </Link>
                    <Link to="/owner/tickets">
                        <Button size="4" variant="ghost" color="green">
                            Tickets
                        </Button>
                    </Link>
                    </>
                ) : user?.rol === "client" ? (
                    <>
                    <Link to="/user/routines">
                        <Button size="4" variant="ghost" color="green">
                            Rutinas
                        </Button>
                    </Link>
                    <Link to="/user/add-tickets">
                        <Button size="4" variant="ghost" color="green">
                            Crear ticket
                        </Button>
                    </Link>
                    </>
                ) : null}      
            </div>
            </div>

                
            
            <div className="flex flex-col md:flex-row gap-3 mb-5 md:mb-0 md:mr-4 items-center">
                {user ? (
                    <>
                    <Link to="/profile">
                        <Button size="3" variant="surface" color="green">
                            {user.username}
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button size="3" variant="solid" color="green" onClick={logoutUser}>
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
                        </Link><Link to="/register-client">
                                <Button size="2" variant="surface" color="green">
                                    Registrarse
                                </Button>
                            </Link>
                            </>
                ) }

                
                
                
            </div>
        </header>
    );
};

export default Header;
