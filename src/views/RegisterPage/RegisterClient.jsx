import React, { useState } from "react";
import { HiUser, HiLockClosed, HiOutlineMail, HiPhone } from "react-icons/hi";
import { HiHome } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";
import { postToApiRegister } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';

const ClientRegister = () => {

  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null); 

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    try {
      const { name, lastName, email, phoneNumber, address, username, password } = formData;

      const requestBody = {
        name,
        lastName,
        email,
        phoneNumber,
        address,
        userCustom: {
          username,
          password
        }
      };

      if (isChecked) {
        const response = await postToApiRegister('owners/create/', requestBody);
        if (!response.ok) {
          throw new Error('Error al crear propietario');
        }
        console.log('Propietario creado exitosamente');
        navigate('/login');
      } else {
        throw new Error('Debes aceptar los Términos y Condiciones para registrarte');
      }
    } catch (error) {
      setError(error.message);
      console.error('Hubo un error al crear el propietario:', error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre del gimnasio tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
  };

  const patterns = {
    mail: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  };

  return (
    <div className="flex flex-col mt-3 md:flex-row justify-center items-center min-h-screen md:m-0 m-5">
      <div className="max-w-2xl p-10 border border-radixgreen rounded-lg shadow-xl mb-8 md:mb-0 md:mr-8">
        <div className="w-full">
          <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
            Registro de nuevo propietario
          </h2>
          {error && (
          <div className="text-red-500">{error}</div>
        )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative flex items-center mb-4">
              <HiUser className="w-6 h-6 text-radixgreen mr-3" />
              <label htmlFor="name" className="mr-3">Nombre</label>
              <input
                {...register("name", {
                  required: messages.req,
                })}
                name="name"
                type="text"
                className={`w-full pl-4 pr-100000 px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "3rem" }}
              />
            </div>
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
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
                className={`w-full px-4 py-3 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "2.5rem" }}
              />
            </div>

            <div className="relative flex items-center mb-4">
              <HiOutlineMail className="w-6 h-6 text-radixgreen mr-3" />
              <label htmlFor="email" className="mr-3">Correo electrónico</label>
              <input
                {...register("email", {
                  required: messages.req,
                  pattern: { value: patterns.email, message: messages.email }
                })}
                name="email"
                type="email"
                className={`w-full pl-90 px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "1rem" }}
              />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <div className="relative flex items-center mb-4">
              <HiPhone className="w-6 h-6 text-radixgreen mr-3" />
              <label htmlFor="phoneNumber" className="mr-3">Número de telefono</label>
              <input
                {...register("phoneNumber", {
                  required: messages.req,
                  pattern: { value: patterns.phoneNumber, message: messages.phoneNumber }
                })}
                name="phoneNumber"
                type="number"
                className={`w-full px-4 py-3 border rounded-lg ${errors.phoneNumber ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "0.5rem" }}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber.message}</p>
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
                className={`w-full px-4 py-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "2.3rem" }}
              />
            </div>
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}

            <div className="relative flex items-center mb-4">
              <HiHome className="w-6 h-6 text-radixgreen mr-3" />
              <label htmlFor="username" className="mr-3">Nombre de usuario</label>
              <input
                {...register("username", {
                  required: messages.req,
                })}
                name="username"
                type="text"
                className={`w-full pl-4 pr-100000 px-4 py-3 border rounded-lg ${errors.username ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "3rem" }}
              />
            </div>


            <div className="relative flex items-center mb-4">
              <HiLockClosed className="w-6 h-6 text-radixgreen mr-3" />
              <label htmlFor="password" className="mr-3">Contraseña</label>
              <input
                {...register("password", {
                  required: messages.req,
                  minLength: {
                    value: 10,
                    message: "La contraseña debe tener más de 10 caracteres"
                  }
                })}
                name="password"
                type="password"
                className={`w-full pl-4 pr-100000 px-4 py-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-radixgreen'
                  } bg-white text-black`}
                style={{ marginLeft: "3rem" }}
              />
            </div>
            <br></br>
            <input type="checkbox" onChange={() => setIsChecked(!isChecked)} /><p>Acepta los <Link to="/terms-conditions" style={{ color: "blue" }}>Términos y Condiciones</Link></p>

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
        <img
          src="https://img.grouponcdn.com/deal/pzR5AeLirhPUNLX4zHZz/zs-2048x1242/v1/c870x524.jpg"
          alt="Descripción de la imagen"
          className="mt-4 w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ClientRegister;
