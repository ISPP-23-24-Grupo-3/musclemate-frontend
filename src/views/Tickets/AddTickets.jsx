import React, { useState, useContext, useEffect } from "react";
import { postToApi, getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { Button, Select, TextArea, TextField } from "@radix-ui/themes";
import { EquipmentSelect } from "../../components/Equipments";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postToApi("tickets/create/", {
        label,
        description,
        equipment: equipmentId,
        client: user.id,
        status: false,
      });
      if (response.ok) {
        setSuccessMessage("Ticket creado exitosamente");
        setErrorMessage("");
        setLabel("");
        setDescription("");
        setEquipmentId("");
      } else {
        setErrorMessage(
          "Error al crear el ticket. Por favor, inténtelo de nuevo más tarde.",
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

  return (
    <div className="mt-8 flex justify-center mb-8">
      <FormContainer className="w-1/2">
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Ticket
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="label">Asunto:</label>
            <TextField.Input
              type="text"
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Descripción:</label>
            <TextArea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></TextArea>
          </div>
          <div className="flex flex-col">
            <label htmlFor="equipmentId" className="text-gray-800">
              Equipo:
            </label>
            <EquipmentSelect
              id="equipmentId"
              onChange={(eq) => setEquipmentId(eq.target.value)}
            />
          </div>
          {successMessage && (
            <div className="text-green-700">{successMessage}</div>
          )}
          {errorMessage && <div className="text-red-700">{errorMessage}</div>}
          <Button className="w-full" type="submit">
            Agregar Ticket
          </Button>
        </form>
      </FormContainer>
    </div>
  );
};

export default AddTickets;
