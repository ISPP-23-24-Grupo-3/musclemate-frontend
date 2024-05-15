import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineTicket,
  HiOutlineBadgeCheck,
  HiOutlineInformationCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineIdentification,
} from "react-icons/hi";
import { CgGym } from "react-icons/cg";
import { FaFire } from "react-icons/fa6";
import {
  getFromApi,
  postToApi,
  deleteFromApi,
} from "../../utils/functions/api";
import { Button, Heading, Select, TextArea, TextField } from "@radix-ui/themes";
import { FormContainer } from "../../components/Form.jsx";

export default function ReservationClient() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [gymName, setGymName] = useState("No disponible"); // Cambio aquí
  const [error, setError] = useState(null);

  const [reservation, setReservation] = useState(false);

  const [createSuccess, setCreateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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

  useEffect(() => {
    const fetchReservationClientEvent = async () => {
      try {
        const response = await getFromApi(
          `reservations/byClientEvent/${eventId}/`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data) && data.length !== 0) {
            setReservation(data[0]);
          }
        }
      } catch (error) {
        setError("Error al obtener los detalles de la reserva.");
      }
    };
    fetchReservationClientEvent();
  }, [eventId]);

  const handleReservationPost = async () => {
    try {
      const response = await postToApi(`reservations/user/create/`, {
        event: eventId,
      });
      if (response.ok) {
        setCreateSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
        return;
      } else {
        const data = await response.json();
        setError(data.detail || "Error al crear la reserva.");
      }
    } catch (error) {
      setError("Error al crear la reserva.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteFromApi(
        `reservations/delete/${reservation.id}/`,
      );
      if (response.ok) {
        // Si la eliminación es exitosa, mostramos el mensaje de éxito
        setDeleteSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
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
            La reserva ha sido eliminada correctamente.
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
      {createSuccess && (
        <FormContainer role="alert">
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline">
            {" "}
            La reserva ha sido creada correctamente.
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
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineBadgeCheck className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Nombre:</strong>{" "}
              <span>&nbsp;{eventDetails.name}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineInformationCircle className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Descripción:</strong>{" "}
              <span>&nbsp;{eventDetails.description}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineUsers className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Aforo:</strong>{" "}
              <span>&nbsp;{eventDetails.capacity}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineTicket className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Asistentes:</strong>{" "}
              <span>&nbsp;{eventDetails.attendees}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineIdentification className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Instructor:</strong>{" "}
              <span>&nbsp;{eventDetails.instructor}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineCalendar className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Fecha:</strong>{" "}
              <span>&nbsp;{formatDate(eventDetails.date)}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineClock className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Duración:</strong>{" "}
              <span>&nbsp;{eventDetails.duration}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <CgGym className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Gimnasio:</strong>{" "}
              <span>&nbsp;{gymName || "No disponible"}</span>
            </TextField.Root>
          </div>

          <div>
            <TextField.Root>
              <TextField.Slot>
                <FaFire className="size-6 text-radixgreen" />
              </TextField.Slot>
              <strong className="text-radixgreen">Intensidad:</strong>{" "}
              <span>
                &nbsp;{translateEventIntensity(eventDetails.intensity)}
              </span>
            </TextField.Root>
          </div>
        </div>
      </FormContainer>
      <br></br>
      <div>
        {!eventDetails.isClickable && (
          <div>
            <span className="block sm:inline">
              No se pueden hacer reservas para este evento.
            </span>
          </div>
        )}
        {reservation && (
          <FormContainer>
            <Heading size="5" className="text-radixgreen !mb-3 text-center">
              Ya tienes una reserva para este evento
            </Heading>
            <div className="flex justify-center mt-6">
              <button
                name="eliminar"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </FormContainer>
        )}
        {!reservation &&
          eventDetails.isClickable &&
          eventDetails.capacity > eventDetails.attendees && (
            <FormContainer>
              <Heading size="5" className="text-radixgreen !mb-3 text-center">
                Aún no tienes una reserva para este evento
              </Heading>
              <div className="flex justify-center mt-6">
                <Button name="editar" size="3" onClick={handleReservationPost}>
                  Reservar
                </Button>
              </div>
            </FormContainer>
          )}
        {!reservation &&
          eventDetails.isClickable &&
          eventDetails.capacity == eventDetails.attendees && (
            <FormContainer>
              <Heading size="5" className="text-radixgreen !mb-3 text-center">
                Este evento ya está lleno
              </Heading>
            </FormContainer>
          )}
      </div>
    </div>
  );
}
