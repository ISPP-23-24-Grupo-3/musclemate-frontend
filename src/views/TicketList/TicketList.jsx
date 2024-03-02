import React, { useState, useEffect } from "react";
import { HiTicket } from "react-icons/hi";

const TicketList = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      label: "Maquina Rota",
      description: "Casi muero arregladla por favor",
      client_name: "Juan",
    },
    {
      id: 2,
      label: "Maquina Inutil",
      description: "Esta maquina no sirve para nada, no se usa",
      client_name: "Pepe",
    },
  ]);
  const [apiTickets, setApiTickets] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  useEffect(() => {
    const fetchApiTickets = async () => {
      try {
        const response = await fetch("/api/tickets/");
        const data = await response.json();
        setApiTickets(data);
        setApiDataLoaded(true);
      } catch (error) {
        console.error("Error fetching API tickets:", error);
      }
    };

    fetchApiTickets();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Tickets para la máquina de Press de Banca
      </h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} className="bg-white shadow-md p-4 rounded-md mb-4">
            <div className="flex items-center mb-2">
              <HiTicket className="text-green-500 w-6 h-6 mr-2" />
              <div>
                <p className="text-lg font-semibold">{ticket.label}</p>
                <p className="text-sm text-gray-500">{ticket.description}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Client Name: {ticket.client_name}</p>
          </li>
        ))}
        {/* Mostrar los tickets de la API si hay datos */}
        {apiDataLoaded && apiTickets.length > 0 ? (
          apiTickets.map((ticket) => (
            <li key={ticket.id} className="bg-white shadow-md p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <HiTicket className="text-green-500 w-6 h-6 mr-2" />
                <div>
                  {Object.entries(ticket).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-500">
                      {key}: {value}
                    </p>
                  ))}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-red-500">La API no contiene datos.</p>
        )}
      </ul>
    </div>
  );
};

export default TicketList;
