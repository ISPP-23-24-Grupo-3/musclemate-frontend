import { Link } from "react-router-dom";
import "./App.css";
import { Button, Flex } from "@radix-ui/themes";

function App() {
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
