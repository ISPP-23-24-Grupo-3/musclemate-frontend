import React, { useState, useEffect, useContext } from "react";
import { getFromApi } from "../../utils/functions/api";
import { Heading, TextField } from "@radix-ui/themes";
import { IoMdSearch } from "react-icons/io";
import AuthContext from "../../utils/context/AuthContext";
import { RingLoader } from "react-spinners";
import { Ticket } from "../../components/Ticket/Ticket";
import { Link } from "react-router-dom";

const TicketManagementUser = () => {
  const { user } = useContext(AuthContext);
  const [userTickets, setUserTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserTickets = async () => {
      setLoading(true);
      try {
        const profileResponse = await getFromApi(`clients/detail/${user.username}/`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const ticketsResponse = await getFromApi(`tickets/byClient/${profileData.id}/`);
          if (ticketsResponse.ok) {
            const ticketsData = await ticketsResponse.json();
            // Ordenar las incidencias por fecha de forma descendente
            const sortedTickets = ticketsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setUserTickets(sortedTickets);
            setFilteredTickets(sortedTickets);
            setApiDataLoaded(true);
          } else {
            console.error("Error fetching user tickets:", ticketsResponse.status);
          }
        } else {
          console.error("Error fetching user profile:", profileResponse.status);
        }
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      }
      setLoading(false);
    };
  
    fetchUserTickets();
  }, []);
  

  useEffect(() => {
    const normalizeText = (text) => {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const filtered = userTickets.filter(
      (ticket) =>
        normalizeText(ticket.gym_name).includes(normalizeText(searchTerm)) ||
        normalizeText(ticket.equipment_name).includes(normalizeText(searchTerm)) ||
        normalizeText(ticket.label).includes(normalizeText(searchTerm)),
    );
    setFilteredTickets(filtered);
  }, [searchTerm, userTickets]);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 m-5">
      <Heading size="8" className="text-radixgreen !mt-8 !mb-3 text-center">
        Tus Incidencias
      </Heading>
      <div className="mb-4">
        <TextField.Root className="flex-1">
          <TextField.Slot>
            <IoMdSearch />
          </TextField.Slot>
          <TextField.Input
            type="text"
            placeholder="Buscar por nombre de máquina, gimnasio o asunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></TextField.Input>
        </TextField.Root>
      </div>
      {loading ? (
        <RingLoader color="#30A46C" loading={loading} size={60} />
      ) : (
        <ul>
          {apiDataLoaded ? (
            currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <>
                  {ticket.status === "open" ? (
                  <Link to={`${ticket.id}`} key={ticket.id}>
                    <Ticket ticket={ticket} key={ticket.id} disabled />
                  </Link> 
                  ) : ( 
                    <Ticket ticket={ticket} key={ticket.id} disabled />
                )}

                </>
              ))
            ) : (
              <p className="text-red-500">No hay incidencias disponibles.</p>
            )
          ) : (
            <p>Cargando...</p>
          )}
        </ul>
      )}
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

export default TicketManagementUser;
