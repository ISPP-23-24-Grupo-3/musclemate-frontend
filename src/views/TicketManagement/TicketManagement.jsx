import React, { useState, useEffect } from "react";
import { HiTicket } from "react-icons/hi";
import { getFromApi, putToApi } from "../../utils/functions/api";

const TicketManagement = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getFromApi("tickets/");
        if (response.ok) {
          const data = await response.json();
          setAllTickets(data);
          setFilteredTickets(data);
          setApiDataLoaded(true);
        } else {
          console.error("Error fetching API tickets:", response.status);
        }
      } catch (error) {
        console.error("Error fetching API tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    // Filtrar los tickets según el término de búsqueda
    const filtered = allTickets.filter(
      (ticket) =>
        ticket.gym_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.equipment_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchTerm, allTickets]);

  const toggleStatus = async (ticketId) => {
    try {
      const response = await getFromApi(`tickets/detail/${ticketId}/`);
      if (response.ok) {
        const updatedTicket = await response.json();
        setAllTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketId ? updatedTicket : ticket
          )
        );
      } else {
        console.error("Error updating ticket status:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleCheckboxChange = async (event, ticketId) => {
    const { checked } = event.target;
    try {
      const response = await getFromApi(`tickets/detail/${ticketId}/`);
      if (response.ok) {
        const updatedTicket = await response.json();
        console.log(updatedTicket);
        updatedTicket.status = checked; // Actualiza el estado del ticket
        // Realiza la solicitud PUT para actualizar el estado en la base de datos
        const updateResponse = await putToApi(`tickets/update/${ticketId}/`, {
          "label": updatedTicket.label,
          "description": updatedTicket.description,
          "gym": updatedTicket.gym,
          "equipment": updatedTicket.equipment,
          "client": updatedTicket.client,
          "status": updatedTicket.status,
        });
        if (updateResponse.ok) {
          // Si la actualización en la base de datos es exitosa, actualiza el estado localmente
          setAllTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id === ticketId ? updatedTicket : ticket
            )
          );
        } else {
          console.error("Error updating ticket status:", updateResponse.status);
        }
      } else {
        console.error("Error fetching ticket details:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
  

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Lista de Incidencias</h2>
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
          filteredTickets.map((ticket) => (
            <li
              key={ticket.id}
              className="bg-white shadow-md p-4 rounded-md mb-4"
            >
              <div className="flex items-center mb-2">
                <HiTicket
                  className={`text-${ticket.status ? "green" : "red"}-500 w-6 h-6 mr-2 cursor-pointer`}
                  onClick={() => toggleStatus(ticket.id)}
                />
                <div>
                  <div className="flex">
                    <div className="mr-4">
                      <p className="text-radixgreen font-bold mb-1">
                        Máquina:{" "}
                        <span className="text-black">
                          {ticket.equipment_name}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-radixgreen font-bold mb-1">
                        Gimnasio:{" "}
                        <span className="text-black">{ticket.gym_name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4">
                      <p className="text-radixgreen font-bold mb-1">
                        Asunto:{" "}
                        <span className="text-black">{ticket.label}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-radixgreen font-bold mb-1">
                        Cliente:{" "}
                        <span className="text-black">
                          {ticket.client.name}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-radixgreen font-bold mb-1">
                    Descripción:{" "}
                    <span className="text-black">{ticket.description}</span>
                  </p>
                  <div>
                    <p className="text-radixgreen font-bold mb-1">
                      Correo:{" "}
                      <span className="text-black">
                        {ticket.client.email}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-radixgreen font-bold mb-1 mr-4">
                      Fecha:{" "}
                      <span className="text-black">{formatDate(ticket.date)}</span>
                    </p>
                    <input
                      type="checkbox"
                      checked={ticket.status}
                      onChange={(e) => handleCheckboxChange(e, ticket.id)}
                      className="mr-2"
                    />
                    <p className="text-radixgreen font-bold mb-1">
                      <span className={ticket.status ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                        {ticket.status ? "Resuelto" : "No Resuelto"}
                      </span>
                    </p>
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
