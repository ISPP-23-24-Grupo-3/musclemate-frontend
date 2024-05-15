import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate desde react-router-dom
import { postToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { FormContainer } from "../../components/Form";
import axios from "axios";
import { EquipmentSelect } from "../../components/Equipments";

const AddTicketFromDetails = () => {
  const { user } = useContext(AuthContext);
  const { equipmentId } = useParams(); // Obtener el equipmentId de los parámetros de la URL
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación

  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    event.preventDefault();
    if (!label || !description) {
      setErrorMessage("El asunto y la descripción son obligatorios.");
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

      setSuccessMessage("Incidencia creada exitosamente");
      setErrorMessage("");
      setLabel("");
      setDescription("");
      navigate("/user/tickets"); // Realiza la redirección a la página de incidencias después de crear una incidencia exitosamente
    } catch (error) {
      setErrorMessage(
        "Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.",
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="mt-8 flex justify-center mb-8">
      <FormContainer className="">
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Incidencia
        </h2>
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
          <div className="flex flex-col gap-1">
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
          <div className="flex flex-col">
            <strong className="text-radixgreen">Equipo:</strong>{" "}
            <EquipmentSelect defaultValue={equipmentId.toString()} disabled />
          </div>
          {successMessage && (
            <div className="text-green-700">{successMessage}</div>
          )}
          {errorMessage && <div className="text-red-700">{errorMessage}</div>}
          <Button className="w-full" type="submit">
            Agregar Incidencia
          </Button>
        </form>
      </FormContainer>
    </div>
  );
};

export default AddTicketFromDetails;
