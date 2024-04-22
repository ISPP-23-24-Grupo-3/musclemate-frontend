import React, { useState, useContext } from "react";
import { HiUser, HiLockClosed } from "react-icons/hi";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { RingLoader } from "react-spinners"; // Importa el componente del spinner
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";

const UserLogin = () => {
  const { loginUser, error } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar el spinner

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Activar el spinner una vez que se hace clic en el botón
    await loginUser({ username, password });
    setLoading(false); // Desactivar el spinner después de que se complete el inicio de sesión
  };

  return (
    <div className="flex flex-col mt-3 md:flex-row justify-center items-center min-h-screen gap-20">
      <FormContainer>
        <div className="">
          <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
            ¡Bienvenido!
          </h2>
          {error && (
            <div className="mb-2 text-red-500 text-sm text-center">{error}</div>
          )}
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <TextField.Root className="py-2 px-2">
                <TextField.Slot>
                  <HiUser className="size-8 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  radius="large"
                  name="username"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </TextField.Root>
              <TextField.Root className="py-2 px-2">
                <TextField.Slot>
                  <HiLockClosed className="size-8 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </TextField.Root>
            </div>
            <Button
              type="submit"
              size="3"
              variant="solid"
              color="green"
              className="w-full mt-2"
              disabled={loading} // Deshabilitar el botón mientras se carga
              style={{ cursor: loading ? "wait" : "pointer" }} // Cambiar el cursor mientras se carga
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}{" "}
              {/* Cambiar el texto del botón según el estado de carga */}
            </Button>
            {loading && (
              // Muestra el spinner solo si loading es true
              <Flex justify="center" className="mt-2">
                <RingLoader color="#30A46C" loading={loading} size={30} />
              </Flex>
            )}
          </form>
        </div>
      </FormContainer>
      <div className="w-full md:w-1/2">
        <img
          src="https://cdn2.salud180.com/sites/default/files/styles/medium/public/gym-g_0_0.jpg"
          alt="Gym image"
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  );
};

export default UserLogin;
