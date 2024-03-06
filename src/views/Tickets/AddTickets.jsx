import { useState, useContext } from "react";
import AuthContext from "../../utils/context/AuthContext";

const AddTickets = () => {
  const { user } = useContext(AuthContext);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [gymId, setGymId] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label,
          description,
          status,
          gym: gymId,
          equipment: equipmentId,
          client: user.id, // Usuario logueado
        }),
      });
      if (response.ok) {
        setSuccessMessage("Ticket creado exitosamente");
        setLabel("");
        setDescription("");
        setStatus("");
        setGymId("");
        setEquipmentId("");
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
            <label htmlFor="label" className="text-radixgreen">Label:</label>
            <input type="text" id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="text-radixgreen">Descripción:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="status" className="text-radixgreen">Estado:</label>
            <input type="text" id="status" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="gym" className="text-radixgreen">ID del Gimnasio:</label>
            <input type="text" id="gym" value={gymId} onChange={(e) => setGymId(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="equipment" className="text-radixgreen">ID del Equipo:</label>
            <input type="text" id="equipment" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} />
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
