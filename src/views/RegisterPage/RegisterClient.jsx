import React from "react";
import { HiUser, HiOutlineMail,HiPhone } from "react-icons/hi";
import { HiHome} from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";



const ClientRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();


  const postUser = async () => {
    const response = await fetch("/api/users/create/", {
      method: "POST",
      headers : {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "username":"owner1",
         "password": "pbkdf2_sha256$720000$WSQKOFW6AKLFtPIMa6E3aU$QQt4xn2PQjMAW8X31Jf3UXhxp8IkYA82lTbcQaL/K58=",
         "rol": "owner"
      })
      
    })
    return response.json()
  }

  const onSubmit =  (register) => {
    postUser().then(res => console.log(res))
    
  }



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
    <div className="flex flex-col mt-3 md:flex-row justify-center items-center min-h-screen">
      <div className="max-w-2xl p-10 border border-radixgreen rounded-lg shadow-xl mb-8 md:mb-0 md:mr-8">
        <div className="w-full">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Registro de nuevo propietario
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative flex items-center mb-4">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="userName" className="mr-3">Nombre</label>
            <input
              {...register("userName", {
                required: messages.req,
              })}
              name="userName"
              type="text"
              className={`w-full pl-4 pr-100000 px-4 py-3 border rounded-lg ${
                errors.userName ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "3rem" }}
            />
          </div>
          {errors.userName && (
            <p className="text-red-500">{errors.userName.message}</p>
          )}

          <div className="relative flex items-center mb-4">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="lastname" className="mr-3">Apellidos</label>
            <input
              {...register("lastName", {
                required: messages.req
              })}
              name="lastName"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.lastName ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "2.5rem" }}
            />
          </div>

          <div className="relative flex items-center mb-4">
            <HiOutlineMail className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="mail" className="mr-3">Correo electrónico</label>
            <input
              {...register("mail", {
                required: messages.req,
                pattern: { value: patterns.mail, message: messages.mail }
              })}
              name="mail"
              type="email"
              className={`w-full pl-90 px-4 py-3 border rounded-lg ${
                errors.mail ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "1rem" }}
            />
          </div>
          {errors.mail && (
            <p className="text-red-500">{errors.mail.message}</p>
          )}

          <div className="relative flex items-center mb-4">
            <HiPhone className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="phone" className="mr-3">Número de telefono</label>
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
              style={{ marginLeft: "0.5rem" }}
            />
          </div>
          {errors.phone && (
          <p className="text-red-500">{errors.phone.message}</p>
          )}

          <div className="relative flex items-center mb-4">
            <HiHome className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="address" className="mr-3">Dirección</label>
            <input
              {...register("address", {
                required: messages.req
              })}
              name="address"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.address ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "2.3rem" }}
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
      
      <div className="w-full md:w-1/2">
          <img src="https://img.grouponcdn.com/deal/pzR5AeLirhPUNLX4zHZz/zs-2048x1242/v1/c870x524.jpg" alt="Descripción de la imagen" className="mt-4 w-full h-auto"/>
        </div>
    </div>
  );
};

export default ClientRegister;