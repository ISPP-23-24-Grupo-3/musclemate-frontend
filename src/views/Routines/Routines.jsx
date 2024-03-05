import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Section,
  Text,
  IconButton,
  Card,
  TextField,
} from "@radix-ui/themes";
import { FaPencil } from "react-icons/fa6";
import { CgGym, CgSpinner } from "react-icons/cg";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { Error, Info } from "../../components/Callouts/Callouts";
import { useForm } from "react-hook-form";
import AuthContext from "../../utils/context/AuthContext";

export const Routines = () => {
  const [error, setError] = useState("");
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRoutines = async (client) => {
      try {
        const response = await fetch("/api/routines/");
        if (!response.ok) {
          setError(
            "There was a problem while searching your routines (Unexpected status code). Please stand by.",
          );
        }
        const routines = await response.json();
        return routines.filter((routine) => routine.client === client.id);
      } catch (error) {
        setError(
          "There was a problem while searching your routines. Please stand by.",
        );
      }
    };

    const fetchClient = async () => {
      try {
        const response = await fetch("api/clients/");
        if (!response.ok) {
          setError("Error while fetching client");
        }
        const clients = await response.json();
        return clients.find((client) => client.user == user.username);
      } catch (error) {
        setError("Error while fetching client");
      }
    };

    fetchClient()
      .then((cl) => fetchRoutines(cl))
      .then((r) => setRoutines(r));
  }, [user.username]);

  return (
    <Section>
      <Heading
        size="8"
        className="text-radixgreen !mb-3 text-center md:text-left"
      >
        Mis Rutinas
      </Heading>

      <RoutineForm set_routines={setRoutines} routines={routines} />

      {error ? (
        <Error message={error} size="3" />
      ) : (
        <ListRoutines routines={routines} />
      )}
    </Section>
  );
};

const ListRoutines = ({ routines }) => {
  const navigate = useNavigate();
  const editRoutine = () => navigate("edit");
  const startRoutine = () => navigate("start");

  if (routines.length === 0) {
    return (
      <Info size="3" message="You don't have routines currently registered." />
    );
  }
  return (
    <Flex gap="4" direction="column">
      {routines.map((routine) => (
        <div
          key={routine.id}
          className="bg-radixgreen/10 p-4 flex items-center justify-between rounded-lg"
        >
          <Text style={{ textOverflow: "ellipsis" }} size="5" weight="bold">
            {routine.name}
          </Text>
          <Box>
            <IconButton size="3" mr="2" radius="full" onClick={editRoutine}>
              <FaPencil />
            </IconButton>
            <IconButton size="3" radius="full" onClick={startRoutine}>
              <CgGym className="size-6 rotate-30" />
            </IconButton>
          </Box>
        </div>
      ))}
    </Flex>
  );
};

const RoutineForm = ({ set_routines, routines }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [visible_form, set_visible_form] = useState(false);
  const addRoutine = () => set_visible_form(true);

  const onSubmit = (data) => {
    set_routines([data, ...routines]);
    set_visible_form(false);
    reset();
  };
  return (
    <>
      <Button
        className="w-full"
        type="submit"
        mb="5"
        size="3"
        variant="solid"
        onClick={addRoutine}
      >
        <IoMdAddCircleOutline className="size-6" />
        Añadir rutina
      </Button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${!visible_form && "hidden"} rounded-lg mb-4 p-5 px-3 flex justify-between border border-radixgreen/30`}
      >
        <TextField.Input
          className="flex-1"
          {...register("name")}
        ></TextField.Input>
        <Button className="">Aceptar</Button>
      </form>
    </>
  );
};

ListRoutines.propTypes = {
  routines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
