import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromApi } from "../../utils/functions/api";

const EquipmentDetails = () => {
  const { id } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [gymName, setGymName] = useState(null);
  const [error, setError] = useState(null);

  // Traducción de los grupos musculares
  const translateMuscularGroup = (group) => {
    switch (group) {
      case "arms":
        return "Brazos";
      case "legs":
        return "Piernas";
      case "core":
        return "Core";
      case "chest":
        return "Pecho";
      case "back":
        return "Espalda";
      case "shoulders":
        return "Hombros";
      case "other":
        return "Otros";
      default:
        return group;
    }
  };

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const response = await getFromApi(`machines/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setMachineDetails(data);
          // Si la máquina tiene asociado un gimnasio, obtenemos su nombre
          if (data.gym) {
            const gymId = data.gym;
            const gymResponse = await getFromApi(`gyms/${gymId}/`);
            if (gymResponse.ok) {
              const gymData = await gymResponse.json();
              setGymName(gymData.name);
            } else {
              setGymName("Nombre de gimnasio no disponible");
            }
          }
        } else {
          setError("No se encontró la máquina con la ID proporcionada.");
        }
      } catch (error) {
        setError("Error al obtener los detalles de la máquina.");
      }
    };

    fetchMachineDetails();
  }, [id]);

  if (error) {
    return <div className="mt-8 p-4 border border-red-500 rounded bg-red-100 text-red-700 text-center">{error}</div>;
  }

  if (!machineDetails) {
    return <div className="mt-8 p-4 border border-yellow-500 rounded bg-yellow-100 text-yellow-700 text-center">Cargando...</div>;
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="max-w-300px p-10 border border-radixgreen rounded">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Detalles de la Máquina de Gimnasio
        </h2>
        <div className="mb-6">
          <strong className="text-radixgreen">Nombre:</strong> {machineDetails.name}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Descripción:</strong> {machineDetails.description}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Marca:</strong> {machineDetails.brand}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Gimnasio:</strong> {gymName || 'No disponible'}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Grupo Muscular:</strong> {translateMuscularGroup(machineDetails.muscular_group)}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Número de Serie:</strong> {machineDetails.serial_number}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
