import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate desde react-router-dom
import { postToApi, getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import { EquipmentSelect } from "../../components/Equipments";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Usa useNavigate para obtener la función de navegación
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
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
      const response = await postToApi("tickets/create/", {
        label,
        description,
        equipment: equipmentId,
        client: user.id,
        status: false,
      });
      if (response.ok) {
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
      <FormContainer className="w-1/2">
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Incidencia
        </h2>
        {gymPlan === "free" ? (
          <div className="text-red-700">
            La subscripción "{gymPlan}" de tu gimnasio no incluye esta funcionalidad. ¡Contacta con tu gimnasio para adquirir funcionalidades como esta!
          </div>
        ) : (
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
            <div className="flex flex-col">
              <label htmlFor="equipmentId" className="text-gray-800">
                Equipo:
              </label>
              <EquipmentSelect
                id="equipmentId"
                onChange={(eq) => setEquipmentId(eq.target.value)}
                searchable // Habilitar búsqueda
                searchPlaceholder="Buscar máquina..." // Placeholder del campo de búsqueda
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
