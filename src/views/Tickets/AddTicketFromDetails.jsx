import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate desde react-router-dom
import { postToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { FormContainer } from "../../components/Form";

const AddTicketFromDetails = () => {
  const { user } = useContext(AuthContext);
  const { equipmentId } = useParams(); // Obtener el equipmentId de los parámetros de la URL
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación

  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!label || !description) {
      setErrorMessage("El asunto y la descripción son obligatorios.");
      return;
    }
    try {
      const response = await postToApi("tickets/create/", {
        label,
        description,
        equipment: equipmentId, // Usar el equipmentId obtenido de la URL
        client: user.id,
        status: false,
      });
      if (response.ok) {
        setSuccessMessage("Incidencia creada exitosamente");
        setErrorMessage("");
        setLabel("");
        setDescription("");
        navigate("/user/tickets"); // Realiza la redirección a la página de incidencias después de crear una incidencia exitosamente
      } else {
        setErrorMessage(
          "Error al crear la incidencia. Por favor, inténtelo de nuevo más tarde."
        );
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(
        "Error de red o del servidor. Por favor, inténtelo de nuevo más tarde."
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
            <label htmlFor="label">Asunto:</label>
            <TextField.Input
              type="text"
              id="label"
              value={label}
              maxLength={50}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Descripción:</label>
            <TextArea
              id="description"
              value={description}
              maxLength={250}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {successMessage && (
            <div className="text-green-700">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-700">{errorMessage}</div>
          )}
          <Button className="w-full" type="submit">
            Agregar Incidencia
          </Button>
        </form>
      </FormContainer>
    </div>
  );
};

export default AddTicketFromDetails;
