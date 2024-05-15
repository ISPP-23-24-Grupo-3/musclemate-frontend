import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate desde react-router-dom
import {
  postToApi,
  getFromApi,
  postFormToApi,
} from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import { EquipmentSelect } from "../../components/Equipments";
import axios from "axios";

import { FaFileImage } from "react-icons/fa";

const AddTickets = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [gymPlan, setGymPlan] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!label) {
      setErrorMessage("El asunto es obligatorio.");
      setSuccessMessage("");
      return;
    } else if (!description) {
      setErrorMessage("La descripción es obligatoria.");
      setSuccessMessage("");
      return;
    } else if (!equipmentId) {
      setErrorMessage("La máquina es obligatoria.");
      setSuccessMessage("");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("label", label);
      formData.append("description", description);
      formData.append("equipment", equipmentId);
      formData.append("client", user.id);
      formData.append("status", false);
      formData.append("image", image);

      const response = await axios.post(
        `${BASE_URL}/tickets/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("authTokens"))?.access}`,
          },
        },
      );
      console.log(response);
      if (response.status == 201) {
        setSuccessMessage("Incidencia creada exitosamente");
        setErrorMessage("");
        setLabel("");
        setDescription("");
        setEquipmentId("");
        navigate("/user/tickets"); // Realiza la redirección a la página de incidencias después de crear una incidencia exitosamente
      } else {
        setErrorMessage(
          "Error al crear la incidencia. Por favor, inténtelo de nuevo más tarde.",
        );
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(
        "Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.",
      );
      setSuccessMessage("");
    }
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

  return (
    <div className="mt-8 flex justify-center mb-8">
      <FormContainer>
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Incidencia
        </h2>
        {gymPlan === "free" ? (
          <div className="text-red-700">
            La subscripción "{gymPlan}" de tu gimnasio no incluye esta
            funcionalidad. ¡Contacta con tu gimnasio para adquirir
            funcionalidades como esta!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <strong className="text-radixgreen">Asunto:</strong>{" "}
              <TextField.Input
                type="text"
                id="label"
                value={label}
                maxLength={50}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div>
              <strong className="text-radixgreen">Descripción:</strong>{" "}
              <TextArea
                id="description"
                value={description}
                maxLength={250}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <strong className="text-radixgreen">Máquina:</strong>{" "}
              <EquipmentSelect
                id="equipmentId"
                onChange={(eq) => setEquipmentId(eq.target.value)}
                searchable // Habilitar búsqueda
                searchPlaceholder="Buscar máquina..." // Placeholder del campo de búsqueda
              />
            </div>
            <div>
              <strong className="text-radixgreen">Imagen:</strong>{" "}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  setImage(e.target.files[0]);
                }}
              />
            </div>
            {successMessage && (
              <div className="text-green-700">{successMessage}</div>
            )}
            {errorMessage && <div className="text-red-700">{errorMessage}</div>}
            <Button className="w-full" type="submit">
              Agregar Incidencia
            </Button>
          </form>
        )}
      </FormContainer>
    </div>
  );
};

export default AddTickets;
