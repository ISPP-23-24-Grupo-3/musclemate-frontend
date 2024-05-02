import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import SubscriptionContext from "../../utils/context/SubscriptionContext";
import { IoAlertCircleOutline, IoCalendarClearOutline,IoPersonAddOutline, IoPeopleOutline} from "react-icons/io5";
import { PiBarbell } from "react-icons/pi";
import MachineIcon from "../../components/MachineIcon";


export default function OwnerHomePage() {

  return (
    <>
        <div className="flex flex-col gap-0  justify-center items-center mb-5">
        <Heading className="text-4xl font-semibold text-radixgreen">Página principal</Heading>
         </div>
      <div className="container px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          className="bg-[#E6F6EB] rounded-lg border-2 border-opacity-20 border-radixgreen p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-4"
          to="../equipments"
        >
          <MachineIcon />
          <h3 className="text-lg font-semibold text-radixgreen">Administrar máquinas</h3>
          
        </Link>
        <Link
          className="bg-[#E6F6EB] rounded-lg p-6 border-2 border-opacity-20 border-radixgreen shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-4"
          to="../users/register"
        >
          <IoPersonAddOutline className="w-8 h-8" />
          <h3 className="text-lg font-semibold text-radixgreen">Registrar cliente</h3>
          
        </Link>
        <Link
          className="bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
          to="../users"
        >
          <IoPeopleOutline className="w-8 h-8" />
          <h3 className="text-lg font-semibold text-radixgreen">Administrar usuarios</h3>
          
        </Link>
        <Link
          className="bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
          to="../tickets"
        >
          <IoAlertCircleOutline className="w-8 h-8" />
          <h3 className="text-lg font-semibold text-radixgreen">Administrar incidentes</h3>
          
        </Link>
        <Link
          className="bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
          to="../my-gyms"
        >
          <PiBarbell className="w-8 h-8" />
          <h3 className="text-lg font-semibold text-radixgreen">Administrar gimnasios</h3>
          
        </Link>
        <Link
          className="bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
          to="../events"
        >
          <IoCalendarClearOutline className="w-8 h-8" />
          <h3 className="text-lg font-semibold text-radixgreen">Administrar eventos</h3>
          
        </Link>
      </div>
    </>
  );
}
