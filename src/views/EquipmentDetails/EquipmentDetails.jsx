import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EquipmentDetails = () => {
  const { id } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const response = await fetch(`/api/equipments/detail/${id}`);
        if (response.ok) {
          const data = await response.json();
          setMachineDetails(data);
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
    return <div>{error}</div>;
  }

  if (!machineDetails) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Detalles de la Máquina</h2>
      <p>Nombre: {machineDetails.name}</p>
      <p>Descripción: {machineDetails.description}</p>
      {/* Otros detalles de la máquina */}
    </div>
  );
};

export default EquipmentDetails;
