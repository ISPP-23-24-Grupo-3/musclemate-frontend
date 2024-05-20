import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../utils/context/AuthContext";
import {
  HiOutlineUsers,
  HiOutlineTicket,
  HiOutlineBadgeCheck,
  HiOutlineInformationCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineIdentification,
} from "react-icons/hi";
import { getFromApi, putToApi, deleteFromApi } from "../../utils/functions/api";
import { Button, Heading, Select, TextArea, TextField } from "@radix-ui/themes";
import { FormContainer } from "../../components/Form.jsx";
import { useForm } from "react-hook-form";
import { Checkbox } from "@radix-ui/themes";
import { RHFSelect } from "../../components/RHFSelect.jsx";

export default function EquipmentDetails() {
  const { user } = useContext(AuthContext);
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [isClickable, setIsClickable] = useState(null);
  const [isNotice, setIsNotice] = useState(null);
  const [gymName, setGymName] = useState("No disponible"); // Cambio aquí
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre del gimnasio tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
  };

  // Opciones de grupo muscular
  const eventIntensityOptions = [
    { value: "L", label: "Low" },
    { value: "M", label: "Medium" },
    { value: "H", label: "High" },
  ];

  // Traducción de los grupos musculares
  const translateEventIntensity = (intensity) => {
    switch (intensity) {
      case "L":
        return "Baja";
      case "M":
        return "Media";
      case "H":
        return "Alta";
      default:
        return intensity;
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await getFromApi(`events/detail/${eventId}/`);
        if (response.ok) {
          const data = await response.json();
          setEventDetails(data);
          setIsClickable(data.isClickable);
          setIsNotice(data.isNotice);
          if (data.gym) {
            const gymId = data.gym;
            const gymResponse = await getFromApi(`gyms/detail/${gymId}/`);
            if (gymResponse.ok) {
              const gymData = await gymResponse.json();
              setGymName(gymData.name);
            } else {
              setGymName("Nombre de gimnasio no disponible");
            }
          }
        } else {
          setError("No se encontró el evento con la ID proporcionada.");
        }
      } catch (error) {
        setError("Error al obtener los detalles de la evento.");
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleInputChange = (e, field) => {
    setUpdatedDetails({
      ...updatedDetails,
      [field]: e,
    });
  };

  const handleCheckChange = (field) => {
    let updatedValue;
    if (field === "isClickable") {
      setIsClickable(!isClickable);
      updatedValue = !isClickable; // Usar el valor actualizado
    }

    if (field === "isNotice") {
      setIsNotice(!isNotice);
      updatedValue = !isNotice; // Usar el valor actualizado
    }

    setUpdatedDetails({
      ...updatedDetails,
      [field]: updatedValue, // Usar el valor actualizado en setUpdatedDetails
    });
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setUpdatedDetails(eventDetails);
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await putToApi(
        `events/update/${eventId}/`,
        updatedDetails,
      );
      if (response.ok) {
        setEventDetails(updatedDetails);
        setEditMode(false);
      } else {
        const data = await response.json();
        setError(data.detail || "Error al guardar los cambios.");
      }
    } catch (error) {
      setError("Error al guardar los cambios.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteFromApi(`events/delete/${eventId}/`);
      if (response.ok) {
        // Si la eliminación es exitosa, mostramos el mensaje de éxito
        setDeleteSuccess(true);
        setTimeout(() => {
          if (user?.rol === "owner") navigate("/owner/events");
          else if (user?.rol === "gym") navigate("/gym/events");
        }, 2000); // Espera 2 segundos antes de redirigir
        return;
      }
      // Si la respuesta no fue exitosa, se ejecutará el código a continuación
    } catch (error) {
      // Si hay un error durante la solicitud, se ejecutará el código a continuación
      setError("Error al eliminar la máquina.");
      return;
    }
    // Si la ejecución llega a este punto, significa que hubo un problema durante la eliminación
    setError("Error al eliminar la máquina."); // Muestra un mensaje de error genérico
  };

  if (error) {
    return (
      <div className="mt-8 p-4 border border-red-500 rounded bg-red-100 text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="mt-8 p-4 border border-yellow-500 rounded bg-yellow-100 text-yellow-700 text-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {deleteSuccess && (
        <FormContainer role="alert">
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline">
            {" "}
            El evento ha sido eliminado correctamente.
          </span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setDeleteSuccess(false)}
          >
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
        <Heading size="7" className="text-radixgreen !mb-3 text-center">
          Detalles del Evento
        </Heading>
        <div className="flex flex-col gap-3">
          <div>
            <strong className="text-radixgreen">Nombre:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineBadgeCheck className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("name", {
                    required: messages.req,
                    minLength: { value: 5, message: messages.name },
                  })}
                  name="name"
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1"
                  value={updatedDetails.name}
                  onChange={(e) => handleInputChange(e.target.value, "name")}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </TextField.Root>
            ) : (
              <span>{eventDetails.name}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Descripción:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineInformationCircle className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextArea
                  {...register("description", {
                    required: messages.req,
                    minLength: { value: 10, message: messages.description },
                  })}
                  name="description"
                  value={updatedDetails.description}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "description")
                  }
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </TextField.Root>
            ) : (
              <span>{eventDetails.description}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Aforo:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineUsers className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("capacity", { required: messages.req })}
                  name="capacity"
                  type="number"
                  value={updatedDetails.capacity}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "capacity")
                  }
                />
                {errors.capacity && (
                  <p className="text-red-500">{errors.capacity.message}</p>
                )}
              </TextField.Root>
            ) : (
              <span>{eventDetails.capacity}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Asistentes:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineTicket className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("attendees")}
                  name="attendees"
                  type="number"
                  min="0" // Establecer el valor mínimo permitido
                  step="1"
                  value={updatedDetails.attendees}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "attendees")
                  }
                />
              </TextField.Root>
            ) : (
              <span>{eventDetails.attendees}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Instructor:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineIdentification className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("instructor", { required: messages.req })}
                  name="instructor"
                  type="text"
                  value={updatedDetails.instructor}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "instructor")
                  }
                />
                {errors.instructor && (
                  <p className="text-red-500">{errors.instructor.message}</p>
                )}
              </TextField.Root>
            ) : (
              <span>{eventDetails.instructor}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Fecha:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineCalendar className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("date", {
                    required: messages.req,
                  })}
                  name="date"
                  type="date"
                  value={updatedDetails.date}
                  onChange={(e) => handleInputChange(e.target.value, "date")}
                />
                {errors.date && (
                  <p className="text-red-500">{errors.date.message}</p>
                )}
              </TextField.Root>
            ) : (
              <span>{formatDate(eventDetails.date)}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Duración:</strong>{" "}
            {editMode ? (
              <TextField.Root>
                <TextField.Slot>
                  <HiOutlineClock className="size-6 text-radixgreen" />
                </TextField.Slot>
                <TextField.Input
                  {...register("duration", {
                    required: "Este campo es obligatorio",
                  })}
                  name="duration"
                  type="text"
                  value={updatedDetails.duration}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "duration")
                  }
                />
                {errors.duration && (
                  <p className="text-red-500">{errors.duration.message}</p>
                )}
              </TextField.Root>
            ) : (
              <span>{eventDetails.duration}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Gimnasio:</strong>{" "}
            <span>{gymName || "No disponible"}</span>
          </div>
          <div className={`flex ${editMode ? "flex-col" : "gap-1"}`}>
            <strong className="text-radixgreen">Intensidad:</strong>{" "}
            {editMode ? (
              <RHFSelect
                name="intensity"
                defaultValue={updatedDetails.intensity}
                onChange={(e) => handleInputChange(e.target.value, "intensity")}
              >
                {eventIntensityOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </RHFSelect>
            ) : (
              <span>{translateEventIntensity(eventDetails.intensity)}</span>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <strong className="text-radixgreen">Reservable:</strong>{" "}
            {editMode ? (
              <Checkbox
                name="isClickable"
                checked={isClickable}
                onCheckedChange={() => handleCheckChange("isClickable")}
              ></Checkbox>
            ) : (
              <Checkbox
                name="isClickable"
                checked={eventDetails.isClickable}
              ></Checkbox>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <strong className="text-radixgreen">Noticia:</strong>{" "}
            {editMode ? (
              <Checkbox
                name="isNotice"
                checked={isNotice}
                onCheckedChange={() => handleCheckChange("isNotice")}
              ></Checkbox>
            ) : (
              <Checkbox
                name="isNotice"
                checked={eventDetails.isNotice}
              ></Checkbox>
            )}
          </div>

          {editMode && (
            <div className="flex gap-3 self-center">
              <Button size="3" onClick={handleSaveChanges}>
                Guardar
              </Button>
              <Button size="3" variant="surface" onClick={toggleEditMode}>
                Cancelar
              </Button>
            </div>
          )}
          {!editMode && (
            <div className="flex gap-3 self-center">
              <Button name="editar" size="3" onClick={toggleEditMode}>
                Editar
              </Button>
              <button
                name="eliminar"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </FormContainer>
    </div>
  );
}
