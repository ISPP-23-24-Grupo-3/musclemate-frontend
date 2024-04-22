import { useState, useEffect } from "react"; // Importar useEffect y useState
import { Card, Heading, Text } from "@radix-ui/themes";
import { FormContainer } from "../Form";
import PropTypes from "prop-types";
import { Checkbox } from "radix-ui";
import { HiTicket } from "react-icons/hi";
import { IoIosFitness } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const Ticket = ({ ticket, onStatusChange, disabled }) => {
  // Agregar estado local para controlar el estado del ticket
  const [status, setStatus] = useState(ticket.status);

  useEffect(() => {
    setStatus(ticket.status); // Actualizar el estado local al estado del ticket
  }, [ticket.status]);

  return (
    <FormContainer key={ticket.id}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="flex gap-3 justify-between">
            <Heading as="h1">{ticket.label}</Heading>
            <div className="flex items-center gap-2">
              <Checkbox
                disabled={disabled}
                onCheckedChange={(c) => {
                  // Actualizar el estado local y llamar a la función de cambio de estado externa
                  setStatus(c);
                  onStatusChange(c, ticket.id);
                }}
                checked={status} // Usar el estado local para el estado del checkbox
                className={`flex items-center gap-1 border rounded-md p-1 text-${status ? "green" : "red"}-600 border-${status ? "green" : "red"}-500 hover:bg-${status ? "green" : "red"}-500/10 data-state-checked:text-radixgreen data-state-checked:border-radixgreen hover:data-state-checked:bg-radixgreen/10`}
              >
                <HiTicket className="size-6" />
                <Text weight="bold" className="whitespace-pre">
                  {status ? "Resuelto" : "No resuelto"}
                </Text>
              </Checkbox>
            </div>
          </div>
          <Text size="2" color="gray">
            {formatDate(ticket.date)} por {ticket.client.name}
          </Text>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <IoIosFitness className="size-7" />
            {ticket.equipment_name}
          </span>
          <span className="flex items-center gap-1">
            <FaLocationDot className="size-5" />
            {ticket.gym_name}
          </span>
        </div>
        <Card>
          <Text size="4">{ticket.description}</Text>
        </Card>
      </div>
    </FormContainer>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.object,
  onStatusChange: PropTypes.func,
  disabled: PropTypes.bool,
};
