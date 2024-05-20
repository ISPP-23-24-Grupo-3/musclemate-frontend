import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Form";
import { GymSelect } from "../../components/Gyms";
import { RHFSelect } from "../../components/RHFSelect";
import axios from "axios";
import { EquipmentImage } from "../../components/Images";

const GymMachineForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [gym, setGym] = useState([]);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    if (user?.rol === "gym") {
      getFromApi("gyms/detail/" + user?.username + "/")
        .then((response) => response.json())
        .then((data) => setGym(data));
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (machineInfo) => {
    if (user?.rol === "gym") machineInfo.gym = gym.id;
    try {
      const formData = new FormData();
      Object.keys(machineInfo).forEach((key) => {
        formData.append(key, machineInfo[key]);
      });
      formData.set("image", machineInfo.image[0]);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/equipments/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("authTokens"))?.access}`,
          },
        },
      );

      console.log("Máquina agregada exitosamente");
      setCreateSuccess(true);
      setTimeout(() => {
        if (user?.rol === "owner") navigate("/owner/equipments");
        else if (user?.rol === "gym") navigate("/gym/equipments");
      }, 2500);
    } catch (error) {
      console.error("Hubo un error al agregar la máquina:", error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de la máquina debe tener más de 5 caracteres",
    brand: "La marca debe tener más de 3 caracteres",
    serialNumber: "El número de serie debe ser único por gimnasio",
    description: "La descripción debe tener más de 10 caracteres",
    muscularGroup: "El grupo muscular debe ser especificado",
  };

  return (
    <div className="max-w-xl mx-auto">
      {createSuccess && (
        <FormContainer role="alert">
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline">
            {" "}
            La máquina ha sido creada correctamente.
          </span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.354 5.354a2 2 0 00-2.828 0L10 7.172 7.172 5.354a2 2 0 10-2.828 2.828L7.172 10l-2.828 2.828a2 2 0 102.828 2.828L10 12.828l2.828 2.828a2 2 0 102.828-2.828L12.828 10l2.828-2.828a2 2 0 000-2.828z" />
            </svg>
          </span>
        </FormContainer>
      )}
      <FormContainer>
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Agregar máquina de gimnasio
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {user?.rol === "owner" && (
            <div className="flex flex-col">
              <label htmlFor="gym">Gimnasio</label>
              <GymSelect {...register("gym", { required: messages.req })} />
              {errors.gym && (
                <p className="text-red-500">{errors.gym.message}</p>
              )}
            </div>
          )}

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
              Número de serie
            </label>
            <TextField.Input
              {...register("serial_number", {
                required: messages.req,
                pattern: {
                  value: /^[0-9]+$/,
                  message: "El número de serie debe ser numérico",
                },
              })}
              name="serial_number"
              type="text"
            />
            {errors.serial_number && (
              <p className="text-red-500">{errors.serial_number.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="image" className="mr-3">
              Imagen
            </label>
            <input
              {...register("image")}
              type="file"
              onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
            />
            {(image && (
              <span className="size-36 rounded-xl border-2 border-radixgreen overflow-hidden mt-2">
                <img src={image} />
              </span>
            )) || (
              <EquipmentImage
                equipment={{}}
                className="size-36 rounded-xl border-2 border-radixgreen mt-2"
              />
            )}
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
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

export default GymMachineForm;
