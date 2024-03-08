import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { Button } from "@radix-ui/themes";

import Rating from "../../components/Rating";
import { HiTicket } from "react-icons/hi";

const EquipmentDetails = () => {
  const { equipmentId } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [gymName, setGymName] = useState(null);
  const [error, setError] = useState(null);
  const [apiTickets, setApiTickets] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  const [machineRatings, setMachineRatings] = useState([]);
  const [actualRating, setActualRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [valuationOn, setValuationOn] = useState(false);

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

  // Machine Details
  useEffect(() => {
    getFromApi("equipments/detail/"+ equipmentId ) 
    .then((response) => {
        // console.log(response);
        return response.json();
    })
    .then((data) => {
        // console.log(data);
        setMachineDetails(data);
    });
  }, [equipmentId]);

  // Machine Ratings
  useEffect(() => {
    getFromApi("assessments/") 
    .then((response) => {
        // console.log(response);
        return response.json();
    })
    .then((data) => {
        // console.log(data.filter((rating) => rating.equipment === Number(equipmentId)).map((rating) => rating.stars));
        const ratings = data.filter((rating) => rating.equipment === Number(equipmentId)).map((rating) => rating.stars);
        // console.log(ratings);
        setMachineRatings(ratings); 
      }); 
  }, [equipmentId]);

  // Rating average (shown)
  function actualRate() {
    var value= 0;
    for (let i = 0; i < machineRatings.length; i++) {
      value += machineRatings[i];
      if(i === (machineRatings.length - 1)){
        value= (value/machineRatings.length);
      }
    }
    setActualRating(value);
  }

  useEffect(() => {
    actualRate();
  }, [machineRatings]);

  // Rating average (new - button)
  function newRate() {
    var value= 0;
    for (let i = 0; i < machineRatings.length; i++) {
      value += machineRatings[i];
      if(i === (machineRatings.length - 1)){
        value += newRating;
        value= value/(machineRatings.length + 1);
      }
    }
    setActualRating(value);
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const response = await getFromApi(`equipments/detail/${equipmentId}`);
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
  }, [equipmentId]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getFromApi("tickets/");
        if (response.ok) {
          const data = await response.json();
          const filteredTickets = data.filter(ticket => ticket.equipment_name === machineDetails?.name);
          setApiTickets(filteredTickets);
          setApiDataLoaded(true);
        } else {
          console.error("Error fetching API tickets:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching API tickets:", error);
      }
    };

    if (machineDetails?.name) {
      fetchTickets();
    }
  }, [machineDetails]);

  if (error) {
    return <div className="mt-8 p-4 border border-red-500 rounded bg-red-100 text-red-700 text-center">{error}</div>;
  }

  if (!machineDetails) {
    return <div className="mt-8 p-4 border border-yellow-500 rounded bg-yellow-100 text-yellow-700 text-center">Cargando...</div>;
  }

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <div className="p-10 border border-radixgreen rounded">
        <h2 className="mb-6 text-radixgreen font-bold text-3xl text-center">
          Detalles de la Máquina de Gimnasio
        </h2>
        <div className="mb-4">
          <strong className="text-radixgreen">Nombre:</strong> {machineDetails.name}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Descripción:</strong> {machineDetails.description}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Marca:</strong> {machineDetails.brand}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Gimnasio:</strong> {gymName || 'No disponible'}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Grupo Muscular:</strong> {translateMuscularGroup(machineDetails.muscular_group)}
        </div>
        <div>
          <strong className="text-radixgreen">Número de Serie:</strong> {machineDetails.serial_number}
        </div>

        <div className="mb-6">
            <strong className="text-radixgreen">Valoración:</strong> 
            <Rating rating={actualRating}/>
            <Button onClick={() => setValuationOn(true)} className="ml-2 bg-radixgreen text-white px-2 py-1 rounded">Valorar</Button>
          
          
        </div>



      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Tickets
        </h2>
        <ul>
          {apiDataLoaded && apiTickets.length > 0 ? (
            apiTickets.map(ticket => (
              <li key={ticket.id} className={`bg-white shadow-md p-4 rounded-md mb-4 ${ticket.status ? 'text-green-500' : 'text-red-500'}`}>
                <div className="flex items-center mb-2">
                  <HiTicket className="w-6 h-6 mr-2" />
                  <div>
                    <p className="text-radixgreen font-bold mb-1">Usuario: <span className="text-black">{ticket.client.name} {ticket.client.lastName}</span><span className="ml-7">Asunto: <span className="text-black">{ticket.label}</span></span></p>               
                    <p className="text-radixgreen font-bold mb-1">Descripción: <span className="text-black">{ticket.description}</span></p>
                    <p className="text-radixgreen font-bold mb-1">Gimnasio: <span className="text-black">{ticket.gym_name}</span></p>
                    <p className="text-radixgreen font-bold mb-1">Email: <span className="text-black">{ticket.client.email}</span></p>
                    <p className="text-radixgreen font-bold mb-1">Fecha: <span className="text-black">{formatDate(ticket.date)}</span></p>
                  </div>
                  <div className="ml-auto">
                    {ticket.status ? (
                      <span className="text-green-500 font-bold">Resuelto</span>
                    ) : (
                      <span className="text-red-500 font-bold">No resuelto</span>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-red-500">No hay tickets disponibles.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EquipmentDetails;
