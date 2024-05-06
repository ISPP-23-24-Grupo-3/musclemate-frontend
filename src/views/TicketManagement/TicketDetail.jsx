import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate desde react-router-dom
import { putToApi, getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import { EquipmentSelect } from "../../components/Equipments";
import { useParams } from "react-router-dom";
import { parseImageURL } from "../../utils/functions/images";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const { rol } = user.rol;
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación
  const { ticketId } = useParams();
  const [editMode, setEditMode] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState("");

  const [gymPlan, setGymPlan] = useState("");
  const [ticket, setTicket] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState();
  const [equipmentName, setEquipmentName] = useState(null);

  const handleSaveChanges = async () => {
    try {
      const response = await putToApi(
        `tickets/update/${ticketId}/`,
        updatedDetails,
      );
      if (response.ok) {
        setTicket(updatedDetails);
        setEditMode(false);
      } else {
        const data = await response.json();
        setError(data.detail || "Error al guardar los cambios.");
      }
    } catch (error) {
      setError("Error al guardar los cambios.");
    }
  };

  const handleInputChange = (e, field) => {
    setUpdatedDetails({
      ...updatedDetails,
      [field]: e,
    });
  };

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

  const toggleEditMode = () => {
    if (!editMode) {
      setUpdatedDetails(ticket);
    }
    setEditMode(!editMode);
  };

  useEffect(() => {
    const fetchTicket = async () => {
      getFromApi("tickets/detail/" + ticketId + "/")
        .then((response) => response.json())
        .then((data) => {
          setTicket(data);
          if (data.equipment) {
            const equipmentId = data.equipment;
            getFromApi(`equipments/detail/${equipmentId}/`)
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error("Nombre de máquina no disponible");
                }
              })
              .then((equipmentData) => {
                setEquipmentName(equipmentData.name);
              })
              .catch((error) => {
                setEquipmentName(error.message);
              });
          }
        })
        .catch((error) => {
          setErrorMessage(
            "No se encontró la incidencia con la ID proporcionada.",
          );
        });
    };
    fetchTicket();
  }, [ticketId]);

  if (!ticket) {
    return (
      <div className="mt-8 p-4 border border-yellow-500 rounded bg-yellow-100 text-yellow-700 text-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="mt-8 flex justify-center mb-8">
      <FormContainer>
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Detalles de Incidencia
        </h2>
        {gymPlan === "free" ? (
          <div className="text-red-700">
            La subscripción "{gymPlan}" de tu gimnasio no incluye esta
            funcionalidad. ¡Contacta con tu gimnasio para adquirir
            funcionalidades como esta!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <strong className="text-radixgreen">Asunto:</strong>{" "}
              {editMode ? (
                <TextField.Input
                  name="label"
                  type="text"
                  value={updatedDetails.label}
                  maxLength={50}
                  onChange={(e) => handleInputChange(e.target.value, "label")}
                />
              ) : (
                <span>{ticket.label}</span>
              )}
            </div>
            <div>
              <strong className="text-radixgreen">Descripción:</strong>{" "}
              {editMode ? (
                <TextArea
                  name="label"
                  type="text"
                  value={updatedDetails.description}
                  maxLength={250}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "description")
                  }
                />
              ) : (
                <span>{ticket.description}</span>
              )}
            </div>
            <div className="flex flex-col">
              <strong className="text-radixgreen">Equipo:</strong>{" "}
              {editMode ? (
                <EquipmentSelect
                  name="equipmentId"
                  equipmentName={equipmentName}
                  onChange={(eq) =>
                    handleInputChange(eq.target.value, "equipment")
                  }
                  searchable // Habilitar búsqueda// Placeholder del campo de búsqueda
                />
              ) : (
                <span>{equipmentName}</span>
              )}
            </div>
            <div className="flex flex-col">
              <strong className="text-radixgreen">Equipo:</strong>{" "}
              {editMode ? (
                <input
                  type="file"
                  onChange={(e) =>
                    setUpdatedDetails((d) => ({
                      ...d,
                      image: e.target.files[0],
                    }))
                  }
                />
              ) : (
                ticket.image && <img src={parseImageURL(ticket.image)} />
              )}
            </div>
            {successMessage && (
              <div className="text-green-700">{successMessage}</div>
            )}
            {errorMessage && <div className="text-red-700">{errorMessage}</div>}
            {!editMode && user.rol === "client" && ticket.status === "open" && (
              <Button
                size="3"
                variant="solid"
                color="green"
                onClick={toggleEditMode}
              >
                Editar
              </Button>
            )}
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
          </div>
        )}
      </FormContainer>
    </div>
  );
};

export default AddTickets;
