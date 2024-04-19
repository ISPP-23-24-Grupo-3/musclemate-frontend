import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postToApi } from "../../utils/functions/api";
import { FormContainer } from "../../components/Form";
import { Button, TextField, TextFieldInput } from "@radix-ui/themes";

const CreateGym = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const patterns = {
    mail: /\S+@\S+\.\S+/,
    phoneNumber: /^\d{9}$/,
    zipCode: /^\d{5}$/,
  };

  const onSubmit = async (formData) => {
    try {
      const response = await postToApi("gyms/create/", {
        name: formData.name,
        address: formData.address,
        zip_code: parseInt(formData.zip_code),
        descripcion: formData.descripcion,
        phone_number: parseInt(formData.phone_number),
        email: formData.email,
        userCustom: {
          username: formData.username,
          password: formData.password,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("¡Gimnasio creado exitosamente!");
        setErrorMessage("");
      } else {
        let errorMessage =
          "Error al crear el gimnasio. Por favor, inténtelo de nuevo más tarde.";
        if (data.email) {
          errorMessage = data.email[0]; // Mensaje de error específico del campo de correo electrónico
        } else if (data.userCustom && data.userCustom.username) {
          errorMessage = data.userCustom.username[0]; // Mensaje de error específico del campo de nombre de usuario
        } else if (data.name) {
          errorMessage = data.name[0]; // Mensaje de error específico del campo de nombre
        } else if (data.address) {
          errorMessage = data.address[0]; // Mensaje de error específico del campo de dirección
        } else if (data.zip_code) {
          errorMessage = data.zip_code[0]; // Mensaje de error específico del campo de código postal
        } else if (data.descripcion) {
          errorMessage = data.descripcion[0]; // Mensaje de error específico del campo de descripción
        } else if (data.phone_number) {
          errorMessage = data.phone_number[0]; // Mensaje de error específico del campo de número de teléfono
        }
        setErrorMessage(errorMessage);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(
        "Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.",
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex justify-center">
      <FormContainer className="max-w-xl w-full">
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Gimnasio
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="text-gray-800">
              Nombre:
            </label>
            <TextField.Input
              {...register("name", {
                required: "Este campo es obligatorio",
                maxLength: {
                  value: 50,
                  message: "El campo no debe sobrepasar 50 caracteres",
                },
              })}
              type="text"
              id="name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="text-gray-800">
              Dirección:
            </label>
            <TextField.Input
              {...register("address", {
                required: "Este campo es obligatorio",
                maxLength: {
                  value: 200,
                  message: "El campo no debe sobrepasar 200 caracteres",
                },
              })}
              type="text"
              id="address"
            />
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="zip_code" className="text-gray-800">
              Código Postal:
            </label>
            <TextField.Input
              {...register("zip_code", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: patterns.zipCode,
                  message: "Debe ser un número de 5 dígitos",
                },
              })}
              type="text"
              id="zip_code"
            />
            {errors.zip_code && (
              <p className="text-red-500">{errors.zip_code.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="descripcion" className="text-gray-800">
              Descripción:
            </label>
            <TextField.Input
              {...register("descripcion", {
                required: "Este campo es obligatorio",
                maxLength: {
                  value: 500,
                  message: "El campo no debe sobrepasar 500 caracteres",
                },
              })}
              type="text"
              id="descripcion"
            />
            {errors.descripcion && (
              <p className="text-red-500">{errors.descripcion.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone_number" className="text-gray-800">
              Número de Teléfono:
            </label>
            <TextField.Input
              {...register("phone_number", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: patterns.phoneNumber,
                  message: "Debe ser un número de 9 dígitos",
                },
              })}
              type="tel"
              id="phone_number"
            />
            {errors.phone_number && (
              <p className="text-red-500">{errors.phone_number.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="text-gray-800">
              Correo Electrónico:
            </label>
            <TextFieldInput
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: patterns.mail,
                  message: "Introduce una dirección de correo válida",
                },
              })}
              id="email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="username" className="text-gray-800">
              Nombre de Usuario:
            </label>
            <TextFieldInput
              {...register("username", {
                required: "Este campo es obligatorio",
              })}
              type="text"
              id="username"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-gray-800">
              Contraseña:
            </label>
            <TextFieldInput
              {...register("password", {
                required: "Este campo es obligatorio",
              })}
              type="password"
              id="password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          {successMessage && (
            <div className="text-green-700">{successMessage}</div>
          )}
          {errorMessage && <div className="text-red-700">{errorMessage}</div>}
          <Button type="submit">Crear Gimnasio</Button>
        </form>
      </FormContainer>
    </div>
  );
};

export default CreateGym;
