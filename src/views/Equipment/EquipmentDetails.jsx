import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromApi, putToApi, deleteFromApi } from "../../utils/functions/api";
import {
  Button,
  Heading,
  Select,
  TextArea,
  TextField,
  TextFieldInput,
} from "@radix-ui/themes";
import { FormContainer } from "../../components/Form.jsx";

import Rating from "../../components/Rating";
import { HiTicket } from "react-icons/hi";
import { Checkbox } from "@radix-ui/themes";
import { RHFSelect } from "../../components/RHFSelect.jsx";

export default function EquipmentDetails() {
  const { equipmentId } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [gymName, setGymName] = useState("No disponible"); // Cambio aquí
  const [error, setError] = useState(null);

  const [apiTickets, setApiTickets] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [machineRatings, setMachineRatings] = useState([]);
  const [actualRating, setActualRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [valuationOn, setValuationOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(3); //Salen 3 tickets x pagina

  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Opciones de grupo muscular
  const muscularGroupOptions = [
    { value: "arms", label: "Brazos" },
    { value: "legs", label: "Piernas" },
    { value: "core", label: "Core" },
    { value: "chest", label: "Pecho" },
    { value: "back", label: "Espalda" },
    { value: "shoulders", label: "Hombros" },
    { value: "other", label: "Otros" },
  ];

  // Traducción de los grupos musculares
  const translateMuscularGroup = (group) => {
    switch (group) {
      case "arms":
        return "Brazos";
      case "legs":
        return "Piernas";
      case "core":
        return "Core";
      case "chest":
        return "Pecho";
      case "back":
        return "Espalda";
      case "shoulders":
        return "Hombros";
      case "other":
        return "Otros";
      default:
        return group;
    }
  };

  // Machine Details
  useEffect(() => {
    getFromApi("equipments/detail/" + equipmentId + "/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachineDetails(data);
        // Cambio aquí para obtener el nombre del gimnasio
        if (data.gym) {
          const gymId = data.gym;
          getFromApi(`gyms/detail/${gymId}/`)
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Nombre de gimnasio no disponible");
              }
            })
            .then((gymData) => {
              setGymName(gymData.name);
            })
            .catch((error) => {
              setGymName(error.message);
            });
        }
      })
      .catch((error) => {
        setError("No se encontró la máquina con la ID proporcionada.");
      });
  }, [equipmentId]);

  // Machine Ratings
  useEffect(() => {
    getFromApi("assessments/")
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((data) => {
        // console.log(data.filter((rating) => rating.equipment === Number(equipmentId)).map((rating) => rating.stars));
        const ratings = data
          .filter((rating) => rating.equipment === Number(equipmentId))
          .map((rating) => rating.stars);
        // console.log(ratings);
        setMachineRatings(ratings);
      });
  }, [equipmentId]);

  // Rating average (shown)
  function actualRate() {
    var value = 0;
    for (let i = 0; i < machineRatings.length; i++) {
      value += machineRatings[i];
      if (i === machineRatings.length - 1) {
        value = value / machineRatings.length;
      }
    }
    setActualRating(value);
  }

  useEffect(() => {
    actualRate();
  }, [machineRatings]);

  // Rating average (new - button)
  function newRate() {
    var value = 0;
    machineRatings.push(Number(newRating));
    for (let i = 0; i < machineRatings.length; i++) {
      value += machineRatings[i];
      if (i === machineRatings.length - 1) {
        value = value / machineRatings.length;
      }
    }
    setActualRating(value);
  }

  const handleCheckboxChange = async (event, ticketId) => {
    const { checked } = event.target;
    try {
      const response = await getFromApi(`tickets/detail/${ticketId}/`);
      if (response.ok) {
        const updatedTicket = await response.json();
        updatedTicket.status = checked; // Actualiza el estado del ticket
        // Realiza la solicitud PUT para actualizar el estado en la base de datos
        const updateResponse = await putToApi(`tickets/update/${ticketId}/`, {
          label: updatedTicket.label,
          description: updatedTicket.description,
          gym: updatedTicket.gym,
          equipment: updatedTicket.equipment,
          client: updatedTicket.client,
          status: updatedTicket.status,
        });
        if (updateResponse.ok) {
          // Si la actualización en la base de datos es exitosa, actualiza el estado localmente
          setApiTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id === ticketId ? updatedTicket : ticket,
            ),
          );
        } else {
          console.error("Error updating ticket status:", updateResponse.status);
        }
      } else {
        console.error("Error fetching ticket details:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const response = await getFromApi(`equipments/detail/${equipmentId}/`);
        if (response.ok) {
          const data = await response.json();
          setMachineDetails(data);
          // Si la máquina tiene asociado un gimnasio, obtenemos su nombre
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
          setError("No se encontró la máquina con la ID proporcionada.");
        }
      } catch (error) {
        setError("Error al obtener los detalles de la máquina.");
      }
    };

    fetchMachineDetails();
  }, [equipmentId]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getFromApi("tickets/");
        if (response.ok) {
          const data = await response.json();
          const filteredTickets = data.filter(
            (ticket) => ticket.equipment_name === machineDetails?.name,
          );
          // Ordenar los tickets por fecha
          filteredTickets.sort((a, b) => new Date(b.date) - new Date(a.date));
          setApiTickets(filteredTickets);
          setApiDataLoaded(true);
        } else {
          console.error("Error fetching API tickets:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching API tickets:", error);
      }
    };

    if (machineDetails?.name) {
      fetchTickets();
    }
  }, [machineDetails]);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = apiTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e, field) => {
    setUpdatedDetails({
      ...updatedDetails,
      [field]: e,
    });
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setUpdatedDetails(machineDetails);
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await putToApi(
        `equipments/update/${equipmentId}/`,
        updatedDetails,
      );
      if (response.ok) {
        setMachineDetails(updatedDetails);
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
      const response = await deleteFromApi(`equipments/delete/${equipmentId}/`);
      if (response.ok) {
        // Si la eliminación es exitosa, mostramos el mensaje de éxito
        setDeleteSuccess(true);
        return;
      }
      // Si la respuesta no fue exitosa, se ejecutará el código a continuación
    } catch (error) {
      // Si hay un error durante la solicitud, se ejecutará el código a continuación
      setError("Error al eliminar el equipo.");
      return;
    }
    // Si la ejecución llega a este punto, significa que hubo un problema durante la eliminación
    setError("Error al eliminar el equipo."); // Muestra un mensaje de error genérico
  };

  if (error) {
    return (
      <div className="mt-8 p-4 border border-red-500 rounded bg-red-100 text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (!machineDetails) {
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
            El equipo ha sido eliminado correctamente.
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
          Detalles de la Máquina
        </Heading>
        <div className="flex flex-col gap-3">
          <div>
            <strong className="text-radixgreen">Nombre:</strong>{" "}
            {editMode ? (
              <TextField.Input
                name="name"
                type="text"
                className="border border-gray-300 rounded px-2 py-1"
                value={updatedDetails.name}
                onChange={(e) => handleInputChange(e, "name")}
              />
            ) : (
              <span>{machineDetails.name}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Descripción:</strong>{" "}
            {editMode ? (
              <TextArea
                name="description"
                value={updatedDetails.description}
                onChange={(e) => handleInputChange(e, "description")}
              />
            ) : (
              <span>{machineDetails.description}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Marca:</strong>{" "}
            {editMode ? (
              <TextField.Input
                name="brand"
                type="text"
                value={updatedDetails.brand}
                onChange={(e) => handleInputChange(e, "brand")}
              />
            ) : (
              <span>{machineDetails.brand}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Gimnasio:</strong>{" "}
            <span>{gymName || "No disponible"}</span>
          </div>
          <div className={`flex ${editMode ? "flex-col" : "gap-1"}`}>
            <strong className="text-radixgreen">Grupo Muscular:</strong>{" "}
            {editMode ? (
              <RHFSelect
                name="muscular_group"
                defaultValue={updatedDetails.muscular_group}
                onChange={(e) =>
                  handleInputChange(e.target.value, "muscular_group")
                }
              >
                {muscularGroupOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </RHFSelect>
            ) : (
              <span>
                {translateMuscularGroup(machineDetails.muscular_group)}
              </span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Número de Serie:</strong>{" "}
            {editMode ? (
              <TextField.Input
                name="serial_number"
                type="text"
                value={updatedDetails.serial_number}
                onChange={(e) => handleInputChange(e, "serial_number")}
              />
            ) : (
              <span>{machineDetails.serial_number}</span>
            )}
          </div>
          <div>
            <strong className="text-radixgreen">Valoración:</strong>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Rating rating={actualRating} />
            </div>
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
              <Button size="3" onClick={toggleEditMode}>
                Editar
              </Button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </FormContainer>
      <div className="mt-8 text-center md:m-0 m-5">
        <Heading size="7" className="text-radixgreen !mt-8 !mb-3 text-center">
          Tickets
        </Heading>
        <ul>
          {apiDataLoaded && currentTickets.length > 0 ? (
            currentTickets.map((ticket) => (
              <li
                key={ticket.id}
                className={`bg-white shadow-md p-4 rounded-md mb-4 ${
                  ticket.status ? "text-green-500" : "text-red-500"
                }`}
              >
                <div className="flex items-center mb-2">
                  <HiTicket className="w-6 h-6 mr-2" />
                  <div>
                    <p className="text-radixgreen font-bold mb-1">
                      Usuario:{" "}
                      <span className="text-black">
                        {ticket.client.name} {ticket.client.lastName}
                      </span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Asunto: <span className="text-black">{ticket.label}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Descripción:{" "}
                      <span className="text-black">{ticket.description}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Gimnasio:{" "}
                      <span className="text-black">{ticket.gym_name}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Email:{" "}
                      <span className="text-black">{ticket.client.email}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Fecha:{" "}
                      <span className="text-black">
                        {formatDate(ticket.date)}
                      </span>
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Checkbox
                      type="checkbox"
                      checked={ticket.status}
                      onChange={(ch) => handleCheckboxChange(ch, ticket.id)}
                      className="mr-2"
                    />
                    <p className="text-radixgreen font-bold mb-1">
                      <span
                        className={
                          ticket.status
                            ? "text-green-500 ml-2"
                            : "text-red-500 ml-2"
                        }
                      >
                        {ticket.status ? "Resuelto" : "No Resuelto"}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-red-500 mb-6">No hay tickets disponibles.</p>
          )}
        </ul>
        {/* Agregar controles de paginación */}
        <div className="flex justify-center mt-4">
          <ul className="flex">
            <li className="mr-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg"
              >
                Anterior
              </button>
            </li>
            {apiTickets.length > 0 &&
              Array.from(
                { length: Math.ceil(apiTickets.length / ticketsPerPage) },
                (_, i) => (
                  <li key={i} className="mr-2">
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-radixgreen text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ),
              )}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(apiTickets.length / ticketsPerPage)
                }
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg"
              >
                Siguiente
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
