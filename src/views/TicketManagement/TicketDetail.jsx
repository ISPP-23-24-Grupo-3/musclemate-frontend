import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate desde react-router-dom
import { putToApi, getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import { EquipmentSelect } from "../../components/Equipments";
import { useParams } from "react-router-dom";
import { parseImageURL } from "../../utils/functions/images";
import axios from "axios";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const { rol } = user.rol;
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación
  const { ticketId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [updateImage, setUpdateImage] = useState();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState("");

  const [gymPlan, setGymPlan] = useState("");
  const [ticket, setTicket] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState();
  const [equipments, setEquipments] = useState([]);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    Object.keys(updatedDetails).forEach((key) => {
      if (key !== "image") {
        formData.append(key, updatedDetails[key]);
      }
    });
    if (updateImage) {
      formData.append("image", updatedDetails.image);
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/tickets/update/${ticketId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("authTokens"))?.access}`,
          },
        },
      );
      setUpdateImage(undefined);
      setTicket(response.data);
      setEditMode(false);
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

  const getEquipmentName = (id) => {
    if (!equipments) return null;
    return equipments.find((eq) => eq.id == id)?.name;
  };

  useEffect(() => {
    const fetchTicket = async () => {
      getFromApi("tickets/detail/" + ticketId + "/")
        .then((response) => response.json())
        .then((data) => {
          setTicket(data);
        })
        .catch((error) => {
          setErrorMessage(
            "No se encontró la incidencia con la ID proporcionada.",
          );
        });
    };
    fetchTicket();
  }, []);

  useEffect(() => {
    const fetchEquipments = async () => {
      const response = await getFromApi("equipments/");
      const fetched = await response.json();
      setEquipments(fetched);
    };
    fetchEquipments();
  }, []);

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
              <strong className="text-radixgreen">Máquina:</strong>{" "}
              {editMode ? (
                <EquipmentSelect
                  name="equipmentId"
                  // equipmentName={equipmentName}
                  defaultValue={updatedDetails.equipment.toString()}
                  onChange={(eq) =>
                    handleInputChange(eq.target.value, "equipment")
                  }
                  searchable // Habilitar búsqueda// Placeholder del campo de búsqueda
                />
              ) : (
                <span>{getEquipmentName(ticket.equipment)}</span>
              )}
            </div>
            <div className="flex flex-col">
              <strong className="text-radixgreen">Imagen:</strong>{" "}
              {editMode ? (
                <>
                  <input
                    type="file"
                    onChange={(e) => {
                      setUpdatedDetails((d) => ({
                        ...d,
                        image: e.target.files[0],
                      }));
                      setUpdateImage(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                  {updateImage ? (
                    <img className="w-1/3" src={updateImage} />
                  ) : (
                    <img className="w-1/3" src={parseImageURL(ticket.image)} />
                  )}
                </>
              ) : (
                ticket.image && (
                  <img className="w-1/3" src={parseImageURL(ticket.image)} />
                )
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
