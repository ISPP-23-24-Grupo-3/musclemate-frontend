import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HiTicket } from "react-icons/hi";

const TicketList = () => {
  const { id } = useParams();
  const machineId = parseInt(id);
  const [machineName, setMachineName] = useState("");
  const [apiTickets, setApiTickets] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/equipments/")
      .then(response => response.json())
      .then(data => {
        const machine = data.find(machine => machine.id === machineId);
        if (machine) {
          setMachineName(machine.name);
        } else {
          console.error(`No se encontró ninguna máquina con el número de serie ${id}`);
        }
      })
      .catch(error => {
        console.error("Error fetching machine name:", error);
      });
  }, [id]);

  useEffect(() => {
    if (machineName) {
      fetch("/api/tickets/")
        .then(response => response.json())
        .then(data => {
          const filteredTickets = data.filter(ticket => ticket.equipment_name === machineName);
          setApiTickets(filteredTickets);
          setApiDataLoaded(true);
        })
        .catch(error => {
          console.error("Error fetching API tickets:", error);
        });
    }
  }, [machineName]);

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Tickets para la máquina: {machineName}
      </h2>
      <h3 className="text-radixgreen font-bold text-lg mb-2">Nombre de la máquina: <span className="text-black">{machineName}</span></h3>
      <ul>
        {apiDataLoaded && apiTickets.length > 0 ? (
          apiTickets.map(ticket => (
            <li key={ticket.id} className="bg-white shadow-md p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <HiTicket className="text-green-500 w-6 h-6 mr-2" />
                <div>
                  <p className="text-radixgreen font-bold mb-1">Asunto: <span className="text-black">{ticket.label}</span></p>
                  <p className="text-radixgreen font-bold mb-1">Descripción: <span className="text-black">{ticket.description}</span></p>
                  <p className="text-radixgreen font-bold mb-1">Gimnasio: <span className="text-black">{ticket.gym_name}</span></p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-red-500">No hay tickets para esta máquina.</p>
        )}
      </ul>
    </div>
  );
};

export default TicketList;
