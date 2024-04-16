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
  return (
    <FormContainer key={ticket.id}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="flex gap-3 justify-between">
            <Heading as="h1">{ticket.label}</Heading>
            <div className="flex items-center gap-2">
              <Checkbox
                disabled={disabled}
                onCheckedChange={(c) => onStatusChange(c, ticket.id)}
                className="flex items-center gap-1  border rounded-md  p-1
                          text-red-600 border-red-500 hover:bg-red-500/10
                          data-state-checked:text-radixgreen data-state-checked:border-radixgreen hover:data-state-checked:bg-radixgreen/10
                        "
              >
                <HiTicket className="size-6" />
                <Text weight="bold" className="whitespace-pre">
                  {ticket.status ? "Resuelto" : "No resuelto"}
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
