import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Section,
  Text,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { FaPencil } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { Error, Info } from "../../components/Callouts/Callouts";
import { useForm } from "react-hook-form";
import AuthContext from "../../utils/context/AuthContext";

export const Routines = () => {
  const [error, setError] = useState("");
  const [routines, setRoutines] = useState([]);
  const { user } = useContext(AuthContext);
  const [client, setClient] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutines = async (client) => {
      const response = await fetch("/api/routines/");
      const routines = await response.json();
      return routines.filter((routine) => routine.client === client.id);
    };

    const fetchClient = async () => {
      const response = await fetch("api/clients/");
      const clients = await response.json();
      const foundClient = clients.find(
        (client) => client.user == user.username,
      );
      setClient(foundClient);
      return foundClient;
    };

    fetchClient()
      .then((cl) => fetchRoutines(cl))
      .then((r) => setRoutines(r))
      .catch((e) => {
        setError(
          "There was a problem while searching your routines. Please stand by.",
        );
      });
  }, [user.username]);

  return (
    <Section>
      <div className="flex mb-3 justify-between">
        <Heading size="8" className="text-radixgreen text-center md:text-left">
          Mis Rutinas
        </Heading>
      </div>

      <RoutineForm
        client={client}
        set_routines={setRoutines}
        routines={routines}
      />

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
  const editRoutine = (routine) => navigate("edit/" + routine.id);
  const startRoutine = (routine) => navigate("start/" + routine.id);

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
          <Box className={routine.temp_id && "hidden"}>
            <IconButton
              size="3"
              mr="2"
              radius="full"
              onClick={() => editRoutine(routine)}
            >
              <FaPencil />
            </IconButton>
            <IconButton
              size="3"
              radius="full"
              onClick={() => startRoutine(routine)}
            >
              <CgGym className="size-6 rotate-30" />
            </IconButton>
          </Box>
        </div>
      ))}
    </Flex>
  );
};

const RoutineForm = ({ set_routines, routines, client }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    values: {
      client: client.id,
    },
  });
  const [visible_form, set_visible_form] = useState(false);
  const showForm = () => set_visible_form(true);

  const onSubmit = (data) => {
    const tempObject = { ...data, temp_id: Date.now() };
    set_routines((c_routines) => [tempObject, ...c_routines]);

    fetch("api/routines/create/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((posted_routine) => {
        console.log(posted_routine);
        console.log("Success");
        set_routines((c_routines) =>
          c_routines.map((r) =>
            r.temp_id == tempObject.temp_id ? posted_routine : r,
          ),
        );
      })
      .catch((e) => {
        console.log(e);
        console.log("Deleting");
        set_routines(routines.filter((r) => r.temp_id !== tempObject.temp_id));
      });

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
        onClick={showForm}
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
