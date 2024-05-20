import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Form";
import { GymSelect } from "../../components/Gyms";
import { RHFSelect } from "../../components/RHFSelect";

const AddEventsForm = () => {
  const { user } = useContext(AuthContext);
  const [genError, setGenError] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [gym, setGym] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const navigate = useNavigate();

  async function getGymsOwner() {
    const responseGym = await getFromApi("gyms/");
    return responseGym.json();
  }

  async function getGym() {
    const responseGym = await getFromApi("gyms/detail/" + user?.username + "/");
    return responseGym.json();
  }

  useEffect(() => {
    if (user?.rol === "owner") {
      getGymsOwner()
        .then((gyms) => setGyms(gyms))
        .catch((error) => console.log(error));
    } else if (user?.rol === "gym") {
      getGym()
        .then((gym) => setGym(gym))
        .catch((error) => console.log(error));
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ values: { gym: selectedGym } });

  const onSubmit = async (eventInfo) => {
    try {
      setGenError("");
      const durationHours = Math.floor(eventInfo.duration / 60);
      const durationMinutes = eventInfo.duration % 60;
      const durationSeconds = 0;
      const formattedDuration = `${durationHours.toString().padStart(2, "0")}:${durationMinutes.toString().padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;

      const eventData =
        user?.rol === "owner"
          ? { ...eventInfo, duration: formattedDuration }
          : { ...eventInfo, duration: formattedDuration, gym: gym?.id };

      if (eventInfo.attendees > eventInfo.capacity) {
        setGenError("No es posible apuntar más asistentes que el aforo del evento");
        throw new Error("No es posible apuntar más asistentes que el aforo del evento");
      };

      const response = await postToApi("events/create/", eventData);

      if (!response.ok) {
        throw new Error("Error al crear evento");
      }

      console.log("Evento creado exitosamente");
      if (user?.rol === "owner") navigate("/owner/events");
      else if (user?.rol === "gym") navigate("/gym/events");
    } catch (error) {
      console.error("Hubo un error al crear el evento:", error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre del evento debe entre 5 y 100 caracteres",
    description: "La descripción debe tener entre 10 y 255 caracteres",
    muscularGroup: "El grupo muscular debe ser especificado",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormContainer className="md:w-1/2">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Añadir evento
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label htmlFor="name">Titulo del evento</label>
            <TextField.Input
              {...register("name", {
                required: messages.req,
                minLength: { value: 5, message: messages.name },
                maxLength: { value: 100, message: messages.name },
              })}
              name="name"
              type="text"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description">Descripción</label>
            <TextArea
              {...register("description", {
                required: messages.req,
                minLength: { value: 10, message: messages.description },
                maxLength: { value: 255, message: messages.description },
              })}
              name="description"
              rows="4"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacity">Aforo</label>
            <TextField.Input
              {...register("capacity", {
                required: messages.req,
                min: {
                  value: 1,
                  message: "Debe ser mayor o igual a 1",
                },
              })}
              name="capacity"
              type="number"
              min="1"
            />
            {errors.capacity && (
              <p className="text-red-500">{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="attendees">Asistentes</label>
            <TextField.Input
              {...register("attendees", {
                min: {
                  value: 0,
                  message: "Debe ser mayor o igual a 0",
                },
              })}
              name="attendees"
              type="number"
              min="0"
            />
            {errors.attendees && (
              <p className="text-red-500">{errors.attendees.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="instructor">Monitor</label>
            <TextField.Input
              {...register("instructor", {
                required: messages.req,
                maxLength: {
                  value: 100,
                  message: "Debe tener como máximo 100 caracteres",
                },
              })}
              name="instructor"
              type="text"
            />
            {errors.instructor && (
              <p className="text-red-500">{errors.instructor.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="date">Fecha del evento</label>
            <TextField.Input
              {...register("date", {
                required: messages.req,
                validate: {
                  futureDate: (date) =>
                    new Date(date) > new Date() || "Debe ser una fecha futura",
                },
              })}
              name="date"
              type="date"
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="duration">Duración (en minutos)</label>
            <TextField.Input
              {...register("duration", {
                required: "Este campo es obligatorio",
                min: {
                  value: 1,
                  message: "Debe ser mayor o igual a 1",
                },
              })}
              name="duration"
              type="number"
              min="1"
            />
            {errors.duration && (
              <p className="text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="intensity">Intensidad del evento</label>
            <RHFSelect
              placeholder="Selecciona una intensidad"
              {...register("intensity", { required: messages.req })}
            >
              <Select.Item value="L">Baja</Select.Item>
              <Select.Item value="M">Media</Select.Item>
              <Select.Item value="H">Alta</Select.Item>
            </RHFSelect>
            {errors.intensity && (
              <p className="text-red-500">{errors.intensity.message}</p>
            )}
          </div>

          {user?.rol === "owner" && (
            <div className="flex flex-col">
              <label htmlFor="gym">Gimnasio</label>
              <GymSelect {...register("gym", { required: messages.req })} />
              {errors.gym && (
                <p className="text-red-500">{errors.gym.message}</p>
              )}
            </div>
          )}

          {genError && (<p className="text-red-500">{genError}</p>)}

          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full py-3"
          >
            Publicar Evento
          </Button>
        </form>
      </FormContainer>
    </div>
  );
};

export default AddEventsForm;
