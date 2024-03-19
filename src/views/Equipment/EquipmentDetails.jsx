import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromApi, putToApi } from "../../utils/functions/api";
import { Button, Heading, TextField } from "@radix-ui/themes";

import Rating from "../../components/Rating";
import { HiTicket } from "react-icons/hi";

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

  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState(null);

  // Opciones de grupo muscular
  const muscularGroupOptions = [
    { value: "arms", label: "Brazos" },
    { value: "legs", label: "Piernas" },
    { value: "core", label: "Core" },
    { value: "chest", label: "Pecho" },
    { value: "back", label: "Espalda" },
    { value: "shoulders", label: "Hombros" },
    { value: "other", label: "Otros" }
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
              ticket.id === ticketId ? updatedTicket : ticket
            )
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
            (ticket) => ticket.equipment_name === machineDetails?.name
          );
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

  const handleInputChange = (e, field) => {
    setUpdatedDetails({
      ...updatedDetails,
      [field]: e.target.value
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
      const response = await putToApi(`equipments/update/${equipmentId}/`, updatedDetails);
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
    <div className="mt-8 max-w-xl mx-auto">
      <div className="p-10 border border-radixgreen rounded md:m-0 m-5">
      <Heading
        size="7"
        className="text-radixgreen !mb-3 text-center"
      >
        Detalles de la Máquina
      </Heading>
        <div className="mb-4">
          <strong className="text-radixgreen">Nombre:</strong>{" "}
          {editMode ? (
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1"
              value={updatedDetails.name}
              onChange={(e) => handleInputChange(e, "name")}
            />
          ) : (
            <span>{machineDetails.name}</span>
          )}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Descripción:</strong>{" "}
          {editMode ? (
            <textarea
              className="border border-gray-300 rounded px-2 py-1"
              value={updatedDetails.description}
              onChange={(e) => handleInputChange(e, "description")}
            />
          ) : (
            <span>{machineDetails.description}</span>
          )}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Marca:</strong>{" "}
          {editMode ? (
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1"
              value={updatedDetails.brand}
              onChange={(e) => handleInputChange(e, "brand")}
            />
          ) : (
            <span>{machineDetails.brand}</span>
          )}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Gimnasio:</strong>{" "}
          <span>{gymName || 'No disponible'}</span>
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Grupo Muscular:</strong>{" "}
          {editMode ? (
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={updatedDetails.muscular_group}
              onChange={(e) => handleInputChange(e, "muscular_group")}
            >
              {muscularGroupOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <span>{translateMuscularGroup(machineDetails.muscular_group)}</span>
          )}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Número de Serie:</strong>{" "}
          {editMode ? (
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1"
              value={updatedDetails.serial_number}
              onChange={(e) => handleInputChange(e, "serial_number")}
            />
          ) : (
            <span>{machineDetails.serial_number}</span>
          )}
        </div>
        <div className="mb-4">
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
          <div className="mt-4 text-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleSaveChanges}
            >
              Guardar
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleEditMode}
            >
              Cancelar
            </button>
          </div>
        )}
        {!editMode && (
          <div className="mt-4 text-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleEditMode}
            >
              Editar
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 text-center md:m-0 m-5">
      <Heading
        size="7"
        className="text-radixgreen !mt-8 !mb-3 text-center"
      >
        Tickets
      </Heading>
        <ul>
          {apiDataLoaded && apiTickets.length > 0 ? (
            apiTickets.map((ticket) => (
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
                        Asunto:{" "}
                        <span className="text-black">{ticket.label}</span>
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
                    <input
                      type="checkbox"
                      checked={ticket.status}
                      onChange={(e) => handleCheckboxChange(e, ticket.id)}
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
      </div>
    </div>
  );
}
