import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getFromApi, postToApi, putToApi } from "../../utils/functions/api";
import { Button, TextField } from "@radix-ui/themes";

import Rating from "../../components/Rating";

import { HiTicket } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";

import AuthContext from "../../utils/context/AuthContext"; "../../utils/context/AuthContext";

const EquipmentDetailsClient = () => {
  const { user } = useContext(AuthContext);

  const { equipmentId } = useParams();
  const [machineDetails, setMachineDetails] = useState(null);
  const [gymName, setGymName] = useState(null);
  const [error, setError] = useState(null);
  const [apiTickets, setApiTickets] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  const [actualRating, setActualRating] = useState(0);
  const [valuationOn, setValuationOn] = useState(false);

  const [hasValoration, setHasValoration] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [clientUsername, setClientUsername] = useState(null);
  const [clientId, setClientId] = useState(null);

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

  // Datos del Usuario
  useEffect(() => {
    if(user?.rol === "client"){
      setIsClient(true);
      setClientId(user.user_id);
      setClientUsername(user.username);
    }
  }, [user]);

  // Machine Ratings
  useEffect(() => {
    getFromApi(`assessments/detail/${clientId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const hasValor= data.some((valoration) => valoration.equipment === Number(equipmentId)).map((valoration) => valoration.stars);
      setHasValoration(hasValor);
      const valor= data.filter((valoration) => valoration.equipment === Number(equipmentId)).map((valoration) => valoration.stars);
      setActualRating(valor);
    });
  }, [clientId]);

  // Machine Details
  useEffect(() => {
    getFromApi("equipments/detail/"+ equipmentId +"/" ) 
    .then((response) => {
        // console.log(response);
        return response.json();
    })
    .then((data) => {
        // console.log(data);
        setMachineDetails(data);
    });
  }, [equipmentId]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const response = await getFromApi(`equipments/detail/${equipmentId}/`);
        if (response.ok) {
          const data = await response.json();
          setMachineDetails(data);
          // Si la máquina tiene asociado un gimnasio, obtenemos su nombre
          if (data.gym) {
            const gymId = data.gym;
            const gymResponse = await getFromApi(`gyms/detail/${gymId}/`);
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
        <div className="mb-4">
          <strong className="text-radixgreen">Número de Serie:</strong> {machineDetails.serial_number}
        </div>

        <div className="mb-4">
          <strong className="text-radixgreen">Tu Valoración:</strong> 
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Rating rating={actualRating}/>
            <Button onClick={() => setValuationOn(!valuationOn)} className="ml-2 bg-radixgreen text-white px-2 py-1 rounded">
              {valuationOn ? 'Volver' : 'Valorar'}
            </Button>
          </div>
        </div>

        {actualRating}

        {valuationOn && /*isClient*/ (
          <div>
            <div className="mb-4">
              <strong className="text-radixgreen">Su Valoración:</strong> 
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Rating rating={actualRating}/>

                <TextField.Input type="number" value={actualRating} onChange={(e) => {
                  e.target.value > 5 ? e.target.value = 5 : e.target.value < 0 ? e.target.value = 0 : e.target.value;
                  setActualRating(e.target.value);
                }} min="0" max="5" step="0.5" className="w-16" />

                <Button onClick={() => {setValuationOn(false);}} className="ml-2 bg-radixgreen text-white px-2 py-1 rounded">
                  Actualizar valoración
                </Button>

                {/* <Button onClick={async () => {

                  if (hasValoration) {              
                    putToApi('assessments/update/'+ valorationId, {
                      stars: actualRating,
                      equipment: Number(equipmentId),
                      client: Number(clientId)
                    });
                  } else {
                    postToApi('assessments/create', {
                      id: Math.floor(Math.random() * 1000000),
                      stars: actualRating,
                      equipment: Number(equipmentId),
                      client: Number(clientId)
                    });
                  }
                  setValuationOn(false);
                }} className="ml-2 bg-radixgreen text-white px-2 py-1 rounded">
                  Actualizar Valoración
                </Button>  */}
                
              </div>      
            </div>
          </div>
        )}


      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Tickets
        </h2>
        <Button>
          <IoMdAddCircleOutline className="size-6" />
          Añadir ticket
        </Button>
        <ul className="mt-4">
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
            <p className="text-red-500 mb-6">No hay tickets disponibles.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EquipmentDetailsClient;
