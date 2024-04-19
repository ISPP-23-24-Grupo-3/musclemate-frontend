import React, { useState, useEffect } from "react";
import { HiTicket } from "react-icons/hi";
import { getFromApi, putToApi } from "../../utils/functions/api";
import { Card, Heading, Text, TextArea, TextField } from "@radix-ui/themes";
import { IoMdSearch, IoIosFitness } from "react-icons/io";
import { Checkbox } from "radix-ui";
import { FormContainer } from "../../components/Form";
import { FaLocationDot } from "react-icons/fa6";
import { Ticket } from "../../components/Ticket/Ticket";

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
    console.log(checked);
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

  return (
    <div className="max-w-xl md:mx-auto">
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
            placeholder="Buscar por máquina o gimnasio"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></TextField.Input>
        </TextField.Root>
      </div>
      <div className="flex flex-col gap-4">
        {apiDataLoaded && currentTickets.length > 0 ? (
          currentTickets.map((ticket) => (
            <Ticket
              ticket={ticket}
              key={ticket.id}
              onStatusChange={handleCheckboxChange}
            />
          ))
        ) : (
          <p className="text-red-500">No hay tickets disponibles.</p>
        )}
      </div>
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
