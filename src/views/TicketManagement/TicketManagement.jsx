import React, { useState, useEffect } from "react";
import { HiTicket } from "react-icons/hi";

const TicketManagement = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/tickets/")
      .then(response => response.json())
      .then(data => {
        setAllTickets(data);
        setFilteredTickets(data); 
        setApiDataLoaded(true);
      })
      .catch(error => {
        console.error("Error fetching API tickets:", error);
      });
  }, []);

  useEffect(() => {
    // Filtrar los tickets según el término de búsqueda
    const filtered = allTickets.filter(ticket =>
      ticket.gym_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.equipment_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchTerm, allTickets]);

  const toggleStatus = (ticketId) => {
    setAllTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, resolved: !ticket.resolved } : ticket
      )
    );
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Lista de Incidencias
      </h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre de máquina o gimnasio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
      </div>
      <ul>
        {apiDataLoaded && filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <li key={ticket.id} className="bg-white shadow-md p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <HiTicket className={`text-${ticket.resolved ? 'green' : 'red'}-500 w-6 h-6 mr-2 cursor-pointer`}
                          onClick={() => toggleStatus(ticket.id)} />
                <div>
                  <div className="flex">
                    <div className="mr-4">
                      <p className="text-radixgreen font-bold mb-1">Gimnasio: <span className="text-black">{ticket.gym_name}</span></p>
                    </div>
                    <div>
                      <p className="text-radixgreen font-bold mb-1">Máquina: <span className="text-black">{ticket.equipment_name}</span></p>
                    </div>
                  </div>
                  <p className="text-radixgreen font-bold mb-1">Asunto: <span className="text-black">{ticket.label}</span></p>
                  <p className="text-radixgreen font-bold mb-1">Descripción: <span className="text-black">{ticket.description}</span></p>
                  <div className="flex">
                    <div className="mr-4">
                      <p className="text-radixgreen font-bold mb-1">Email: <span className="text-black">{ticket.client_email}</span></p>
                    </div>
                    <div>
                      <p className={`text-${ticket.resolved ? 'green' : 'red'}-500 font-bold mb-1 cursor-pointer`}
                         onClick={() => toggleStatus(ticket.id)}>
                        {ticket.resolved ? 'Resuelto' : 'No Resuelto'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-red-500">No hay tickets disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default TicketManagement;
