import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Form";

const AddEventsForm = () => {
  const { user } = useContext(AuthContext);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const navigate = useNavigate();

  async function getGyms() {
    const responseGym = await getFromApi("gyms/");
    return responseGym.json();
  }

  useEffect(() => {
    getGyms()
      .then((gyms) => setGyms(gyms))
      .catch((error) => console.log(error));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ values: { gym: selectedGym } });

  const onSubmit = async (eventInfo) => {
    try {
      const durationHours = Math.floor(eventInfo.duration / 60);
      const durationMinutes = eventInfo.duration % 60;
      const durationSeconds = 0;
      const formattedDuration = `${durationHours.toString().padStart(2, "0")}:${durationMinutes.toString().padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;

      const eventData = { ...eventInfo, duration: formattedDuration };

      const currentDate = new Date().toISOString().split("T")[0];
      console.log(currentDate);
      console.log(eventInfo.date);

      if (eventInfo.date < currentDate) {
        throw new Error("La fecha debe ser posterior a la fecha actual");
      } else {
        const response = await postToApi("events/create/", eventData);

        if (!response.ok) {
          throw new Error("Error al crear evento");
        }

        console.log("Evento creado exitosamente");
        navigate("/owner/events");
      }
    } catch (error) {
      console.error("Hubo un error al crear el evento:", error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre del evento debe tener más de 5 caracteres",
    description: "La descripción debe tener más de 10 caracteres",
    muscularGroup: "El grupo muscular debe ser especificado",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormContainer className="md:w-1/2">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Crear evento
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label htmlFor="name">Titulo del evento</label>
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

          <div>
            <label htmlFor="description">Descripción</label>
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

          <div>
            <label htmlFor="capacity">Aforo</label>
            <TextField.Input
              {...register("capacity", { required: messages.req })}
              name="capacity"
              type="number"
              min="0" // Establecer el valor mínimo permitido
              step="1"
            />
          </div>
          {errors.capacity && (
            <p className="text-red-500">{errors.capacity.message}</p>
          )}

          <div>
            <label htmlFor="attendees">Asistentes</label>
            <TextField.Input
              {...register("attendees")}
              name="attendees"
              type="number"
              min="0" // Establecer el valor mínimo permitido
              step="1"
            />
          </div>

          <div>
            <label htmlFor="instructor">Monitor</label>
            <TextField.Input
              {...register("instructor", { required: messages.req })}
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
              })}
              name="duration"
              type="number"
            />
            {errors.duration && (
              <p className="text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="intensity">Intensidad del evento</label>
            <Select.Root
              {...register("intensity", { required: messages.req })}
              name="intensity"
              type="text"
            >
              <Select.Trigger placeholder="Selecciona una intensidad"></Select.Trigger>
              <Select.Content position="popper">
                <Select.Item value="L">Low</Select.Item>
                <Select.Item value="M">Medium</Select.Item>
                <Select.Item value="H">High</Select.Item>
              </Select.Content>
            </Select.Root>
            {errors.intensity && (
              <p className="text-red-500">{errors.intensity.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="gym">Gimnasio</label>
            <Select.Root
              {...register("gym", { required: messages.req })}
              name="gym"
            >
              <Select.Trigger placeholder="Seleccionar gimnasio"></Select.Trigger>
              <Select.Content position="popper">
                {gyms &&
                  gyms.map((gym) => (
                    <Select.Item key={gym.id} value={gym.id.toString()}>
                      {gym.name}
                    </Select.Item>
                  ))}
              </Select.Content>
            </Select.Root>
            {errors.gym && <p className="text-red-500">{errors.gym.message}</p>}
          </div>

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
