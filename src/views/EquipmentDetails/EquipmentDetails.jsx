import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import gymMachineImage from "../../assets/images/gym_reg.jpg"; // Importa la imagen de la máquina de gimnasio

const EquipmentDetails = () => {
  const { serialNumber } = useParams();

  // Utiliza el serialNumber para obtener los detalles de la máquina desde la base de datos
  // Por ahora, simularemos algunos datos de la máquina
  const [machineDetails, setMachineDetails] = useState({
    name: "Máquina de Press de Banca",
    description:
      "Esta máquina de press de banca es ideal para el desarrollo de los músculos pectorales. Cuenta con un diseño ergonómico y ajustable para adaptarse a diferentes usuarios.",
    brand: "FitnessPro",
    model: "FP-2000",
    serialNumber: "123456789",
    year: "2023",
    condition: "Excelente",
    gymLocation: "Gimnasio ABC",
  });

  useEffect(() => {
    // Aquí podrías realizar una solicitud HTTP para obtener los detalles de la máquina del servidor
    // Ejemplo de solicitud ficticia
    // fetchMachineDetails(serialNumber).then((data) => setMachineDetails(data));
  }, [serialNumber]);

  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
      <div className="max-w-300px p-10 border border-radixgreen rounded md:mr-8">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Detalles de la Máquina de Gimnasio
        </h2>
        <div className="mb-6">
          <strong>Nombre:</strong> {machineDetails.name}
        </div>
        <div className="mb-6">
          <strong>Descripción:</strong> {machineDetails.description}
        </div>
        <div className="mb-6">
          <strong>Marca:</strong> {machineDetails.brand}
        </div>
        <div className="mb-6">
          <strong>Modelo:</strong> {machineDetails.model}
        </div>
        <div className="mb-6">
          <strong>Número de Serie:</strong> {machineDetails.serialNumber}
        </div>
        <div className="mb-6">
          <strong>Año de Fabricación:</strong> {machineDetails.year}
        </div>
        <div className="mb-6">
          <strong>Condición:</strong> {machineDetails.condition}
        </div>
        <div className="mb-6">
          <strong>Ubicación en el Gimnasio:</strong>{" "}
          {machineDetails.gymLocation}
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <img src={gymMachineImage} alt="Máquina de Gimnasio" className="h-auto" />
      </div>
    </div>
  );
};

export default EquipmentDetails;
