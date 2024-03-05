import { Button, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="flex flex-col md:flex-row items-center justify-between border-b-2 border-black">
            <Link to="/">
                <Flex align="center" className="md:m-4">
                    <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
                    <h1 className="text-xl font-bold">MuscleMate</h1>
                </Flex>
            </Link>
            <div className="md:m-4 mb-4 flex flex-col md:flex-row gap-3 items-center">
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
                
            </div>
        </header>
    );
};

export default Header;
