import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Form";
import { RHFSelect } from "../../components/RHFSelect";

const GymMachineFormGym = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [gym, setGym] = useState([]);

  useEffect(() => {
    getFromApi("gyms/detail/" + user?.username + "/")
    .then((response) => response.json())
    .then((data) => setGym(data));
  }, [gym]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (machineInfo) => {
    machineInfo.gym = gym.id;
    try {
      const response = await postToApi("equipments/create/", machineInfo);

      if (!response.ok) {
        throw new Error("Error al agregar la máquina");
      }

      console.log("Máquina agregada exitosamente");
      navigate("/gym/equipments");
    } catch (error) {
      console.error("Hubo un error al agregar la máquina:", error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de la máquina debe tener más de 5 caracteres",
    brand: "La marca debe tener más de 3 caracteres",
    reference: "El número de referencia debe ser único por gimnasio",
    description: "La descripción debe tener más de 10 caracteres",
    muscularGroup: "El grupo muscular debe ser especificado",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormContainer>
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Agregar máquina de gimnasio
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="name" className="mr-3">
              Nombre de la máquina
            </label>
            <TextField.Input
              {...register("name", {
                required: messages.req,
                minLength: { value: 5, message: messages.name },
              })}
              name="name"
              type="text"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="brand" className="mr-3">
              Marca
            </label>
            <TextField.Input
              {...register("brand", {
                required: messages.req,
                minLength: { value: 3, message: messages.brand },
              })}
              name="brand"
              type="text"
            />
            {errors.brand && (
              <p className="text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="serial_number" className="mr-3">
              Número de referencia
            </label>
            <TextField.Input
              {...register("serial_number", { required: messages.req })}
              name="serial_number"
              type="text"
            />
            {errors.serial_number && (
              <p className="text-red-500">{errors.serial_number.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="mr-3">
              Descripción
            </label>
            <TextArea
              {...register("description", {
                required: messages.req,
                minLength: { value: 10, message: messages.description },
              })}
              name="description"
              rows="4"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="muscular_group">Grupo muscular</label>
            <RHFSelect
              placeholder="Selecciona un grupo muscular"
              {...register("muscular_group", { required: messages.req })}
            >
              <Select.Item value="arms">Brazos</Select.Item>
              <Select.Item value="legs">Piernas</Select.Item>
              <Select.Item value="core">Abdominales</Select.Item>
              <Select.Item value="chest">Pecho</Select.Item>
              <Select.Item value="back">Espalda</Select.Item>
              <Select.Item value="shoulders">Hombros</Select.Item>
              <Select.Item value="other">Otros</Select.Item>
            </RHFSelect>
            {errors.muscular_group && (
              <p className="text-red-500">{errors.muscular_group.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full py-3"
          >
            Agregar máquina
          </Button>
        </form>
      </FormContainer>
    </div>
  );
};

export default GymMachineFormGym;
