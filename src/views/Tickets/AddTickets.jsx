import React, { useState, useContext, useEffect } from "react";
import { postToApi, getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [equipmentOptions, setEquipmentOptions] = useState([]);

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
        setErrorMessage(""); // Limpiar el mensaje de error si la solicitud es exitosa
        setLabel("");
        setDescription("");
        setEquipmentId("");
      } else {
        setErrorMessage("Error al crear el ticket. Por favor, inténtelo de nuevo más tarde.");
        setSuccessMessage(""); // Limpiar el mensaje de éxito si hay un error
      }
    } catch (error) {
      setErrorMessage("Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.");
      setSuccessMessage(""); // Limpiar el mensaje de éxito si hay un error
    }
  };

  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        const response = await getFromApi("equipments/");
        if (response.ok) {
          const data = await response.json();
          setEquipmentOptions(data.map(equipment => ({
            value: equipment.id,
            label: equipment.name
          })));
        } else {
          setErrorMessage("Error al cargar las máquinas. Por favor, inténtelo de nuevo más tarde.");
        }
      } catch (error) {
        setErrorMessage("Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.");
      }
    };

    fetchEquipmentOptions();
  }, []);

  return (
    <div className="mt-8 flex justify-center mb-8">
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
            <label htmlFor="equipmentId" className="text-gray-800">Equipo:</label>
            <select id="equipmentId" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} className="block w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-radixgreen">
              <option value="">Selecciona una máquina</option>
              {equipmentOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
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
