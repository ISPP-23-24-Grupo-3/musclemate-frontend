import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Form";
import { GymSelect } from "../../components/Gyms";

const GymMachineForm = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ values: { gym: selectedGym, muscular_group: selectedMuscle } });

  const onSubmit = async (machineInfo) => {
    try {
      const response = await postToApi("equipments/create/", machineInfo);

      if (!response.ok) {
        throw new Error("Error al agregar la máquina");
      }

      console.log("Máquina agregada exitosamente");
      navigate("/owner/equipments");
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
            <Select.Root
              {...register("muscular_group", { required: messages.req })}
              onValueChange={(value) => setSelectedMuscle(value)}
            >
              <Select.Trigger placeholder="Selecciona un grupo muscular" />
              <Select.Content position="popper">
                <Select.Item value="arms">Brazos</Select.Item>
                <Select.Item value="legs">Piernas</Select.Item>
                <Select.Item value="core">Abdominales</Select.Item>
                <Select.Item value="chest">Pecho</Select.Item>
                <Select.Item value="back">Espalda</Select.Item>
                <Select.Item value="shoulders">Hombros</Select.Item>
                <Select.Item value="other">Otros</Select.Item>
              </Select.Content>
            </Select.Root>
            {errors.muscular_group && (
              <p className="text-red-500">{errors.muscular_group.message}</p>
            )}
          </div>

          <div className="flex flex-col ">
            <label htmlFor="gym">Gimnasio</label>
            <GymSelect
              {...register("gym", { required: messages.req })}
              onChange={(g) => setSelectedGym(g)}
            />
            {errors.gym && <p className="text-red-500">{errors.gym.message}</p>}
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

export default GymMachineForm;
