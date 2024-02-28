import React from "react";
import { HiUser, HiLockClosed, HiOutlineMail } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";
import { Link } from "react-router-dom";




const UserRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (userInfo) => console.log(userInfo);

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de usuario tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres"
  };

  const patterns = {
    mail: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-2xl p-10 border border-radixgreen rounded-lg shadow-xl">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          ¡Regístrese hoy mismo!
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative flex items-center">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="userName">Nombre de usuario</label>
            <input
              {...register("userName", {
                required: messages.req,
                minLength: { value: 8, message: messages.name }
              })}
              name="userName"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.userName ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>
          {errors.userName && (
            <p className="text-red-500">{errors.userName.message}</p>
          )}

          <div className="relative flex items-center">
            <HiOutlineMail className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="mail">Correo electrónico</label>
            <input
              {...register("mail", {
                required: messages.req,
                pattern: { value: patterns.mail, message: messages.mail }
              })}
              name="mail"
              type="email"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.mail ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>
          {errors.mail && (
            <p className="text-red-500">{errors.mail.message}</p>
          )}

          <div className="relative flex items-center">
            <HiLockClosed className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="password">Contraseña</label>
            <input
              {...register("password", {
                required: messages.req,
                minLength: { value: 10, message: messages.password }
              })}
              name="password"
              type="password"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.password ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full py-3"
          >
            Registrarse
          </Button>
          <p className="mt-4">
          ¿Deseas registrarte como cliente?
              <Link to="/register-client" className="ml-2 text-radixgreen">
               Regístrate aquí
              </Link>
          </p>
        </form>
      </div>
      <div className="ml-8">
        <p className="text-gray-600 text-lg">
          Bienvenido a nuestra plataforma de registro. Complete el formulario a la izquierda para crear su cuenta.
        </p>
        <img src="src\assets\images\gym_reg.jpg" alt="Descripción de la imagen" className="mt-4 w-64 h-auto" />
      </div>
    </div>
  );
};

export default UserRegister;