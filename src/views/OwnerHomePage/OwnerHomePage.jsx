import { Button, Flex, Heading } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function OwnerHomePage() {
  return (
    <>
      <Flex align="center" justify="center" direction="row">
        <Heading
          size="6"
          className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
        >
          Bienvenido a
        </Heading>
        <img src="/pwa-64x64.png" alt="Logo" className="ml-2 mr-1 mt-3" />
        <Heading size="6" className="!mt-8 !mb-3 text-center">
          MuscleMate
        </Heading>
      </Flex>

      <Flex direction="column" justify="center" align="center" gap="4" className="mb-5">
        <Link to="../equipments">
          <Button size="4" variant="classic" className="mt-4">
            Mis Máquinas
          </Button>
        </Link>
        <Link to="../users/register">
          <Button size="4" variant="classic" className="mt-4">
            Registrar Cliente
          </Button>
        </Link>
        <Link to="../users">
          <Button size="4" variant="classic" className="mt-4">
            Usuarios
          </Button>
        </Link>
        <Link to="../tickets">
          <Button size="4" variant="classic" className="mt-4">
            Ver Tickets
          </Button>
        </Link>
        <Link to="../my-gyms">
          <Button size="4" variant="classic" className="mt-4">
            Mis Gimnasios
          </Button>
        </Link>
      </Flex>
    </>
  );
}
