import React from "react";
import { HiUser, HiOutlineMail,HiPhone } from "react-icons/hi";
import { HiHome} from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";



const ClientRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (userInfo) => console.log(userInfo);

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre del gimnasio tiene que ser mayor a 8 caracteres",
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
          Registro de nuevo propietario
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative flex items-center">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="userName">Nombre</label>
            <input
              {...register("userName", {
                required: messages.req,
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
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="lastname">Apellidos</label>
            <input
              {...register("userName", {
                required: messages.req
              })}
              name="userName"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.userName ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>

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
            <HiPhone className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="phone">Número de telefono</label>
            <input
              {...register("phone", {
                required: messages.req,
                pattern: { value: patterns.phoneNumber, message: messages.phone}
              })}
              name="phone"
              type="number"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.phone ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>
          {errors.phone && (
          <p className="text-red-500">{errors.phone.message}</p>
          )}

          <div className="relative flex items-center">
            <HiHome className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="address">Dirección</label>
            <input
              {...register("address", {
                required: messages.req
              })}
              name="address"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.address ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>
          {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
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
        </form>
      </div>
    </div>
  );
};

export default ClientRegister;