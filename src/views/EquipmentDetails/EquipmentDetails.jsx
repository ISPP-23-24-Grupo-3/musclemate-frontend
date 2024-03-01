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
          <strong className="text-radixgreen">Gimnasio:</strong> {machineDetails.gym}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Grupo Muscular:</strong> {machineDetails.muscular_group}
        </div>
        <div className="mb-6">
          <strong className="text-radixgreen">Número de Serie:</strong> {machineDetails.serial_number}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
