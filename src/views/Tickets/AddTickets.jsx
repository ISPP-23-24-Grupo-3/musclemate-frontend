import React, { useState, useContext } from "react";
import { postToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

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
        setLabel("");
        setDescription("");
        setEquipmentId("");
      } else {
        setErrorMessage("Error al crear el ticket. Por favor, inténtelo de nuevo más tarde.");
      }
    } catch (error) {
      setErrorMessage("Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.");
    }
  };

  return (
    <div className="mt-8 flex justify-center mb-8"> {/* Agregué un margen inferior */}
      <div className="max-w-xl p-6 border border-gray-300 rounded-md shadow-lg bg-green-100 w-full">
        <h2 className="mb-4 text-radixgreen font-bold text-3xl text-center">
          Crear Ticket
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="label" className="text-gray-800">Asunto:</label>
            <input type="text" id="label" value={label} onChange={(e) => setLabel(e.target.value)} className="block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen" />
          </div>
          <div>
            <label htmlFor="description" className="text-gray-800">Descripción:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen resize-none h-40"></textarea>
          </div>
          <div>
            <label htmlFor="equipmentId" className="text-gray-800">ID del Equipo:</label>
            <input type="text" id="equipmentId" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} className="block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen" />
          </div>
          {successMessage && <div className="text-green-700">{successMessage}</div>}
          {errorMessage && <div className="text-red-700">{errorMessage}</div>}
          <button type="submit" className="bg-radixgreen text-white px-6 py-3 rounded-md hover:bg-opacity-80 focus:outline-none">Agregar Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default AddTickets;
