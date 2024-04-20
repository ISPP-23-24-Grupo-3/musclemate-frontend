import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getFromApi, postToApi, putToApi } from "../../utils/functions/api";
import { Button, TextField } from "@radix-ui/themes";

import Rating, { EditableRating } from "../../components/Rating";

import { HiTicket } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";

import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { Ticket } from "../../components/Ticket/Ticket";
import { RingLoader } from "react-spinners";

const EquipmentDetailsClient = () => {
  const { user } = useContext(AuthContext);

  const { equipmentId } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [apiTickets, setApiTickets] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(3); // 3 tickets por página

  const [actualRating, setActualRating] = useState(0);
  const [valuationOn, setValuationOn] = useState(false);

  const [hasValoration, setHasValoration] = useState(false);
  const [valuationId, setValuationId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [clientUsername, setClientUsername] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [message, setMessage] = useState("");

  const [gymPlan, setGymPlan] = useState("");

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

  // Datos del Usuario
  useEffect(() => {
    if (user.rol === "client") {
      setIsClient(true);
      setClientUsername(user.username);
    }
  }, [user]);

  // Datos del Usuario
  useEffect(() => {
    if (clientUsername) {
      getFromApi("clients/detail/" + clientUsername + "/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setClientId(data.id);
        });
    }
  }, [clientUsername]);

  // Datos de subscripción
  useEffect(() => {
    if (user) {
      getFromApi("clients/detail/" + user.username + "/")
        .then((response) => response.json())
        .then((data) => {
          let gym = data.gym;
          getFromApi("gyms/detail/" + gym + "/")
            .then((response) => response.json())
            .then((data) => {
              setGymPlan(data.subscription_plan);
            });
        });
    }
  }, [user]);

  // Machine Details
  useEffect(() => {
    if (equipmentId) {
      getFromApi("equipments/detail/" + equipmentId + "/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setMachineDetails(data);
        });
    }
  }, [equipmentId]);

  // Machine Ratings
  useEffect(() => {
    if (clientId && equipmentId) {
      getFromApi("assessments/client/" + clientId + "/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const hasValor = data.some(
            (valoration) => valoration.equipment === Number(equipmentId),
          );
          setHasValoration(hasValor);
          if (hasValor) {
            const valor = data
              .filter(
                (valoration) => valoration.equipment === Number(equipmentId),
              )
              .map((valoration) => valoration.stars);
            const valorationId = data
              .filter(
                (valoration) => valoration.equipment === Number(equipmentId),
              )
              .map((valoration) => valoration.id);
            setActualRating(valor);
            setValuationId(valorationId);
          }
        });
    }
  }, [clientId, equipmentId]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchTicketsByClient = async () => {
      try {
        const response = await getFromApi(
          `tickets/byEquipment/${equipmentId}/`,
        );
        if (response.ok) {
          const data = await response.json();
          setApiTickets(data);
          setApiDataLoaded(true);
        } else {
          console.error(
            "Error fetching API tickets by client:",
            response.statusText,
          );
        }
      } catch (error) {
        console.error("Error fetching API tickets by client:", error);
      }
    };

    if (clientId) {
      fetchTicketsByClient();
    }
  }, [clientId]);

  if (!machineDetails) {
    return (
      <div className="mt-8 p-4 border border-yellow-500 rounded bg-yellow-100 text-yellow-700 text-center">
        Cargando...
      </div>
    );
  }

  // Paginación
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = apiTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-xl mx-auto">
      <FormContainer className="">
        <h2 className="mb-6 text-radixgreen font-bold text-3xl text-center">
          Detalles de la Máquina de Gimnasio
        </h2>
        <div className="mb-4">
          <strong className="text-radixgreen">Nombre:</strong>{" "}
          {machineDetails.name}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Descripción:</strong>{" "}
          {machineDetails.description}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Marca:</strong>{" "}
          {machineDetails.brand}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Grupo Muscular:</strong>{" "}
          {translateMuscularGroup(machineDetails.muscular_group)}
        </div>

        <div className="mb-1">
          <strong className="text-radixgreen">Tu Valoración:</strong>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {gymPlan === "free" ? (
              <div className="text-red-700">
                La subscripción de tu gimnasio no incluye esta funcionalidad.
              </div>
            ) : (
              <>
                <EditableRating
                  onChange={(e) => {
                    setActualRating(e);
                  }}
                />

                {isClient && (
                  <div style={{ display: "flex" }}>
                    <Button
                      onClick={async () => {
                        if (hasValoration) {
                          await putToApi(
                            "assessments/update/" + valuationId + "/",
                            {
                              stars: Number(actualRating),
                              equipment: Number(equipmentId),
                              client: Number(clientId),
                            },
                          );
                        } else {
                          await postToApi("assessments/create/", {
                            stars: Number(actualRating),
                            equipment: Number(equipmentId),
                            client: Number(clientId),
                          });
                        }
                        setValuationOn(false);
                        setMessage("¡Valoración Enviada!");
                      }}
                      className="ml-2 bg-radixgreen text-white px-2 py-1 rounded"
                    >
                      Enviar
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center">
          <strong className="text-radixgreen">
            {message && <div>{message}</div>}
          </strong>
        </div>
      </FormContainer>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Incidencias</h2>
        <Link to={`${window.location.pathname}/add-tickets`}>
          <Button>
            <IoMdAddCircleOutline className="size-6" />
            Añadir incidencia
          </Button>
        </Link>
        <ul className="mt-4">
          {apiDataLoaded ? (
            currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <Ticket ticket={ticket} key={ticket.id} disabled />
              ))
            ) : (
              <p className="text-red-500 mb-6">No hay incidencias disponibles.</p>
            )
          ) : (
            <div className="flex justify-center mt-4">
              <RingLoader color={"#123abc"} loading={!apiDataLoaded} /> {/* Loader para los tickets */}
            </div>
          )}
        </ul>
        {/* Agregar controles de paginación si hay más de tres tickets */}
        {apiTickets.length > ticketsPerPage && (
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
        )}
      </div>
    </div>
  );
};

export default EquipmentDetailsClient;