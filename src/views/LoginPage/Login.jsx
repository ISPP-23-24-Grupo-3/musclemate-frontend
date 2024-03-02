import { useRef, useEffect, useContext } from "react";
import loginVideo from "../../assets/other_assets/video_login.mp4"; // Importa el video de inicio de sesión
import { HiUser, HiLockClosed } from "react-icons/hi"; // Importa los iconos de usuario y candado
import { Button } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";


const UserLogin = () => {

  let {loginUser} = useContext(AuthContext)

  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
      <div className="max-w-300px p-10 border border-radixgreen rounded md:mr-8">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          ¡Bienvenido!
        </h2>
        <form onSubmit={loginUser} className="relative">
          <div className="mb-6 relative flex items-center">
            <HiUser className="absolute left-0 w-8 h-8 text-radixgreen ml-4" />
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              className="w-full px-6 py-3 border border-radixgreen rounded-lg bg-white text-black pl-16"
            />
          </div>
          <div className="mb-6 relative flex items-center">
            <HiLockClosed className="absolute left-0 w-8 h-8 text-radixgreen ml-4" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="w-full px-6 py-3 border border-radixgreen rounded-lg bg-white text-black pl-16"
            />
          </div>
          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </form>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <img src="src\assets\images\login_image.jpg" alt="Gym image"/>
      </div>
    </div>
  );
};

export default UserLogin;
