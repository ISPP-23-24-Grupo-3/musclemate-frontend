import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postToApi } from "../../utils/functions/api";

const CreateGym = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

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
          password: formData.password
        }
      });
      if (response.ok) {
        setSuccessMessage("¡Gimnasio creado exitosamente!");
        setErrorMessage("");
      } else {
        setErrorMessage("Error al crear el gimnasio. Por favor, inténtelo de nuevo más tarde.");
        setSuccessMessage(""); 
      }
    } catch (error) {
      setErrorMessage("Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="mt-8 flex justify-center mb-8">
      <div className="max-w-xl p-6 border border-gray-300 rounded-md shadow-lg bg-green-100 w-full">
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Gimnasio
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-gray-800">Nombre:</label>
            <input
              {...register("name", { required: "Este campo es obligatorio" })}
              type="text"
              id="name"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="address" className="text-gray-800">Dirección:</label>
            <input
              {...register("address", { required: "Este campo es obligatorio" })}
              type="text"
              id="address"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>
          <div>
            <label htmlFor="zip_code" className="text-gray-800">Código Postal:</label>
            <input
              {...register("zip_code", { required: "Este campo es obligatorio" })}
              type="text"
              id="zip_code"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.zip_code && <p className="text-red-500">{errors.zip_code.message}</p>}
          </div>
          <div>
            <label htmlFor="descripcion" className="text-gray-800">Descripción:</label>
            <input
              {...register("descripcion", { required: "Este campo es obligatorio" })}
              type="text"
              id="descripcion"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
          </div>
          <div>
            <label htmlFor="phone_number" className="text-gray-800">Número de Teléfono:</label>
            <input
              {...register("phone_number", { required: "Este campo es obligatorio" })}
              type="text"
              id="phone_number"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="text-gray-800">Email:</label>
            <input
              {...register("email", { required: "Este campo es obligatorio" })}
              type="email"
              id="email"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="username" className="text-gray-800">Nombre de Usuario:</label>
            <input
              {...register("username", { required: "Este campo es obligatorio" })}
              type="text"
              id="username"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-gray-800">Contraseña:</label>
            <input
              {...register("password", { required: "Este campo es obligatorio" })}
              type="password"
              id="password"
              className={`block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen`}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          {successMessage && <div className="text-green-700">{successMessage}</div>}
          {errorMessage && <div className="text-red-700">{errorMessage}</div>}
          <button type="submit" className="bg-radixgreen text-white px-6 py-3 rounded-md hover:bg-opacity-80 focus:outline-none">Crear Gimnasio</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGym;
