import React, { useState, useEffect } from "react";
import { HiTicket } from "react-icons/hi";
import { getFromApi, putToApi } from "../../utils/functions/api";
import { Heading, TextField } from "@radix-ui/themes";
import { IoMdSearch } from "react-icons/io";
import { Checkbox } from "radix-ui";

const TicketManagement = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(4);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getFromApi("tickets/");
        if (response.ok) {
          const data = await response.json();
          setAllTickets(data);
          setFilteredTickets(
            data.sort((a, b) => new Date(b.date) - new Date(a.date)),
          ); // Ordenar por fecha
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
    const filtered = allTickets.filter(
      (ticket) =>
        ticket.gym_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTickets(
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date)),
    ); // Ordenar por fecha
  }, [searchTerm, allTickets]);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleStatus = async (ticketId) => {
    try {
      const response = await getFromApi(`tickets/detail/${ticketId}/`);
      if (response.ok) {
        const updatedTicket = await response.json();
        setAllTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketId ? updatedTicket : ticket,
          ),
        );
      } else {
        console.error("Error updating ticket status:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleCheckboxChange = async (checked, ticketId) => {
    try {
      const response = await getFromApi(`tickets/detail/${ticketId}/`);
      if (response.ok) {
        const updatedTicket = await response.json();
        updatedTicket.status = checked;
        const updateResponse = await putToApi(`tickets/update/${ticketId}/`, {
          label: updatedTicket.label,
          description: updatedTicket.description,
          gym: updatedTicket.gym,
          equipment: updatedTicket.equipment,
          client: updatedTicket.client,
          status: updatedTicket.status,
        });
        if (updateResponse.ok) {
          setAllTickets((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id === ticketId ? updatedTicket : ticket,
            ),
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
    <div className="max-w-lg md:mx-auto md:mt-8 m-5">
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Lista de Incidencias
      </Heading>
      <div className="mb-4">
        <TextField.Root className="flex-1">
          <TextField.Slot>
            <IoMdSearch />
          </TextField.Slot>
          <TextField.Input
            type="text"
            placeholder="Buscar por nombre de máquina o gimnasio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></TextField.Input>
        </TextField.Root>
      </div>
      <ul>
        {apiDataLoaded && currentTickets.length > 0 ? (
          currentTickets.map((ticket) => (
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
                  </div>
                  <div>
                    <p className="text-radixgreen font-bold mb-1">
                      Gimnasio:{" "}
                      <span className="text-black">{ticket.gym_name}</span>
                    </p>
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
                        <span className="text-black">{ticket.client.name}</span>
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
                      <span className="text-black">{ticket.client.email}</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-radixgreen font-bold mb-1 mr-4">
                      Fecha:{" "}
                      <span className="text-black">
                        {formatDate(ticket.date)}
                      </span>
                    </p>
                    <Checkbox
                      checked={ticket.status}
                      onChange={(c) => handleCheckboxChange(c, ticket.id)}
                    />
                    <p className="text-radixgreen font-bold mb-1">
                      <span
                        className={
                          ticket.status
                            ? "text-green-500 ml-2"
                            : "text-red-500 ml-2"
                        }
                      >
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
      {/* Agregar controles de paginación */}
      <div className="flex justify-center mt-4">
        <ul className="flex">
          <li className="mr-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg"
            >
              Anterior
            </button>
          </li>
          {filteredTickets.length > 0 &&
            Array.from(
              { length: Math.ceil(filteredTickets.length / ticketsPerPage) },
              (_, i) => (
                <li key={i} className="mr-2">
                  <button
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-radixgreen text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ),
            )}
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredTickets.length / ticketsPerPage)
              }
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg"
            >
              Siguiente
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TicketManagement;
