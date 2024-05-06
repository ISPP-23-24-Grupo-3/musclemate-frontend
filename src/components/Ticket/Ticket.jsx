import { useState, useEffect, useContext } from "react"; // Importar useEffect y useState
import { Card, Heading, Text, Select, TextField, Button } from "@radix-ui/themes";
import { FormContainer } from "../Form";
import PropTypes from "prop-types";
import { HiTicket } from "react-icons/hi";
import { IoIosFitness } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { RHFSelect } from "../../components/RHFSelect";
import { Checkbox } from "radix-ui";
import AuthContext from "../../utils/context/AuthContext";
import { OpacityIcon } from "@radix-ui/react-icons";


const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const Ticket = ({ ticket, onStatusChange, onResponseChange, onResponseSubmit, disabled }) => {
  // Agregar estado local para controlar el estado del ticket
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(ticket.status);
  const [ticketColor, setTicketColor] = useState("black");
  const [response, setResponse] = useState("");

  const statusOptions = [
    { value: "open", label: "Abierto" },
    { value: "in progress", label: "En Proceso" },
    { value: "seen", label: "Visto" },
    { value: "closed", label: "Cerrado" },
  ];

  useEffect(() => {
    console.log(`http://http://127.0.0.1:8000/${ticket.image}`)
    switch (ticket.status) {
      case "open":
        setStatus("Abierto");
        setTicketColor("green");
        break;
      case "in progress":
        setStatus("En progreso");
        setTicketColor("orange");
        break;
      case "seen":
        setStatus("Visto");
        setTicketColor("blue");
        break;
      case "closed":
        setStatus("Cerrado");
        setTicketColor("red");
    } // Actualizar el estado local al estado del ticket
  }, [ticket.status]);



  return (
    <FormContainer key={ticket.id}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <Heading as="h1">{ticket.label}</Heading>
            <div className="gray-border" >
              {(user.rol === "owner" || user.rol === "gym") ? (
                <RHFSelect
                  name="status"
                  defaultValue={ticket.status}
                  className={'w-60'}
                  onChange={(e) => {
                    setStatus(e.target.value)
                    onStatusChange(e.target.value, ticket.id)
                  }}
                >
                  {statusOptions.map((option) => (
                    <Select.Item  key={option.value} value={option.value}>
                      <Text className="font-bold" style={{color: ticketColor}}>{option.label}</Text>
                    </Select.Item>
                  ))}
                </RHFSelect>
              ) : (
                <div className={'border rounded-md p-1 data-state-checked:text-radixgreen data-state-checked:border-radixgreen hover:data-state-checked:bg-radixgreen/10'}>
                  <Text className="font-bold" style={{color: ticketColor}}>{status}</Text>
                </div>
              )
              }

            </div>
          </div>
          <Text size="2" color="gray">
            {formatDate(ticket.date)} por {ticket.client.name}
          </Text>
        </div>
        {ticket.image &&
          <div className="flex items-center flex-wrap gap-3">
            <img src={`http://127.0.0.1:8000/${ticket.image}`}></img>
          </div>
        }
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
        {ticket.response ? (
          <div>
            <strong className="text-radixgreen">Respuesta:</strong>{" "}
            <Card>
              <Text size="4">{ticket.response}</Text>
            </Card>
          </div>
        ) : (
          <>
            {(user.rol === "owner" || user.rol === "gym") &&
            <>
              <div >
                <strong className="text-radixgreen">Respuesta:</strong>{" "}
                <TextField.Input
                  type="text"
                  placeholder="Escribe tu respuesta a la incidencia..."
                  className="w-7/10"
                  onChange={(e) => {
                    setResponse(e.target.value)
                    onResponseChange(e.target.value, ticket.id)
                  }}>
                </TextField.Input>
              </div>
              <Button
              onClick={onResponseSubmit}> Enviar Respuesta</Button>
              </>
            }
          </>
        )}
      </div>
    </FormContainer>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.object,
  onStatusChange: PropTypes.func,
  onResponseChange: PropTypes.func,
  onResponseSubmit: PropTypes.func,
  disabled: PropTypes.bool,
};
