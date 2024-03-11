import React, { useState, useContext } from "react";
import { postToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [gymId, setGymId] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [status, setStatus] = useState(false); // Inicializado a false
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postToApi("tickets/create/", {
        label,
        description,
        gym: gymId,
        client: user.id, // Usamos el ID de cliente del contexto de autenticación
        equipment: equipmentId,
        status,
      });
      if (response.ok) {
        setSuccessMessage("Ticket creado exitosamente");
        setLabel("");
        setDescription("");
        setGymId("");
        setEquipmentId("");
        setStatus(false);
      } else {
        setErrorMessage("Error al crear el ticket. Por favor, inténtelo de nuevo más tarde.");
      }
    } catch (error) {
      setErrorMessage("Error de red o del servidor. Por favor, inténtelo de nuevo más tarde.");
    }
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="max-w-300px p-10 border border-radixgreen rounded">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Agregar Ticket
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="label" className="text-radixgreen">Asunto:</label>
            <input type="text" id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="text-radixgreen">Descripción:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="gymId" className="text-radixgreen">ID del Gimnasio:</label>
            <input type="text" id="gymId" value={gymId} onChange={(e) => setGymId(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="equipmentId" className="text-radixgreen">ID del Equipo:</label>
            <input type="text" id="equipmentId" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="status" className="text-radixgreen">Estado:</label>
            <input type="checkbox" id="status" checked={status} onChange={(e) => setStatus(e.target.checked)} />
          </div>
          {successMessage && <div className="text-green-700 mb-4">{successMessage}</div>}
          {errorMessage && <div className="text-red-700 mb-4">{errorMessage}</div>}
          <button type="submit" className="bg-radixgreen text-white px-4 py-2 rounded">Agregar Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default AddTickets;
