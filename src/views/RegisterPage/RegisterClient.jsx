import React, { useState, useEffect } from "react";
import { HiUser, HiLockClosed, HiOutlineMail, HiPhone } from "react-icons/hi";
import { HiHome } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@radix-ui/themes";
import { postToApiRegister } from "../../utils/functions/api";
import { useNavigate, Link } from "react-router-dom";
import { FormContainer } from "../../components/Form";
import { Checkbox } from "@radix-ui/themes";

const ClientRegister = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const {
        name,
        lastName,
        email,
        phoneNumber,
        address,
        username,
        password,
      } = formData;

      const requestBody = {
        name,
        lastName,
        email,
        phoneNumber,
        address,
        userCustom: {
          username,
          password,
        },
      };

      const response = await postToApiRegister("owners/create/", requestBody);
      if (response.ok) {
        console.log("Propietario creado exitosamente");
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Espera 2 segundos antes de redirigir
      } else {
        throw new Error("Error al crear propietario");
      }
    } catch (error) {
      setError(error.message);
      console.error("Hubo un error al crear el propietario:", error);
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

  useEffect(() => {
    let redirectTimer;
    if (success) {
      redirectTimer = setTimeout(() => {
        navigate("/login");
      }, 2000); // Espera 2 segundos antes de redirigir
    }
    return () => clearTimeout(redirectTimer);
  }, [success, navigate]);

  return (
    <div className="flex gap-10 flex-col md:flex-row justify-center items-center">
      <FormContainer className="">
        <div className="w-full">
          <h2 className="mb-3 text-radixgreen font-bold text-4xl text-center">
            Registro de nuevo propietario
          </h2>
          {error && <div className="text-red-500">{error}</div>}
          {success && (
            <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
              Registro completado
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col">
              <label htmlFor="name" className="mr-3">
                Nombre
              </label>
              <TextField.Root>
                <TextField.Slot>
                  <HiUser className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("name", {
                    required: messages.req,
                  })}
                  name="name"
                  type="text"
                />
              </TextField.Root>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="lastname" className="mr-3">
                Apellidos
              </label>
              <TextField.Root>
                <TextField.Slot>
                  <HiUser className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("lastName", {
                    required: messages.req,
                  })}
                  name="lastName"
                  type="text"
                />
              </TextField.Root>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email">Correo electrónico</label>
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineMail className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("email", {
                    required: messages.req,
                    pattern: { value: patterns.email, message: messages.email },
                  })}
                  name="email"
                  type="email"
                />
              </TextField.Root>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="mr-3">
                Número de telefono
              </label>
              <TextField.Root>
                <TextField.Slot>
                  <HiPhone className="size-6 text-radixgreen mr-3" />
                </TextField.Slot>
                <TextField.Input
                  {...register("phoneNumber", {
                    required: messages.req,
                    pattern: {
                      value: patterns.phoneNumber,
                      message: messages.phoneNumber,
                    },
                  })}
                  name="phoneNumber"
                  type="tel"
                />
              </TextField.Root>
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="address">Dirección</label>
              <TextField.Root>
                <TextField.Slot>
                  <HiHome className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("address", {
                    required: messages.req,
                  })}
                  name="address"
                  type="text"
                />
              </TextField.Root>
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="username">Nombre de usuario</label>
              <TextField.Root>
                <TextField.Slot>
                  <HiHome className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("username", {
                    required: messages.req,
                  })}
                  name="username"
                  type="text"
                />
              </TextField.Root>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Contraseña</label>
              <TextField.Root>
                <TextField.Slot>
                  <HiLockClosed className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("password", {
                    required: messages.req,
                    minLength: {
                      value: 10,
                      message: "La contraseña debe tener más de 10 caracteres",
                    },
                  })}
                  name="password"
                  type="password"
                />
              </TextField.Root>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <Checkbox onChange={(c) => setIsChecked(c)}></Checkbox>
              <p>
                Acepta los{" "}
                <Link to="/terms-conditions">Términos y Condiciones</Link>
              </p>
            </div>

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
      </FormContainer>

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
