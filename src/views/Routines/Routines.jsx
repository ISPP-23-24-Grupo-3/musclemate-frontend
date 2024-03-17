import { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Section,
  Text,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { CgGym, CgSpinner } from "react-icons/cg";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { Error, Info } from "../../components/Callouts/Callouts";
import { useForm } from "react-hook-form";
import * as Collapsible from "@radix-ui/react-collapsible";
import { getFromApi, postToApi } from "../../utils/functions/api";

export const Routines = () => {
  const [error, setError] = useState("");
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const response = await getFromApi("routines/");
      const fetchedRoutines = await response.json();
      return fetchedRoutines;
    };

    fetchRoutines()
      .then((r) => setRoutines(r))
      .catch(() => {
        setError(
          "There was a problem while searching your routines. Please stand by.",
        );
      });
  }, []);

  return (
    <Section className="md:m-0 m-5">
      <div className="flex mb-3 justify-between">
        <Heading size="8" className="text-radixgreen text-center md:text-left">
          Mis Rutinas
        </Heading>
      </div>

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
  const editRoutine = (routine) => navigate("/user/routines/" + routine.id);
  const startRoutine = (routine) => navigate("start/" + routine.id);

  if (routines.length === 0) {
    return (
      <Info size="3" message="You don't have routines currently registered." />
    );
  }
  return (
    <Flex gap="4" direction="column">
      {routines.map((routine) => (
        <Button
          key={routine.id}
          variant="soft"
          size="4"
          className="bg-radixgreen/10 !items-center !p-7 !justify-between "
          onClick={() => editRoutine(routine)}
        >
          <span className="flex gap-3 items-center">
            <Text style={{ textOverflow: "ellipsis" }} size="5" weight="bold">
              {routine.name}
            </Text>
            {routine.temp_id && <CgSpinner className="size-6 animate-spin" />}
          </span>
          <IconButton
            size="3"
            radius="full"
            onClick={() => startRoutine(routine)}
          >
            <CgGym className="size-6 rotate-30" />
          </IconButton>
        </Button>
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

  const isUnique = (routineName) => {
    return (
      routines.every((r) => routineName != r.name) ||
      "Ya tienes una rutina con ese nombre"
    );
  };

  const onSubmit = (data) => {
    const tempObject = { ...data, temp_id: Date.now() };
    set_routines((c_routines) => [tempObject, ...c_routines]);

    postToApi("routines/create/", data)
      .then((res) => {
        if (!res.ok) throw new Error("Something went wrong");
        return res.json();
      })
      .then((posted_routine) => {
        set_routines((c_routines) =>
          c_routines.map((r) =>
            r.temp_id == tempObject.temp_id ? posted_routine : r,
          ),
        );
      })
      .catch((e) => {
        set_routines(routines.filter((r) => r.temp_id !== tempObject.temp_id));
      });

    reset();
  };

  return (
    <>
      <Collapsible.Root>
        <Collapsible.Trigger className="w-full">
          <Button
            className="w-full"
            type="submit"
            mb="5"
            size="3"
            variant="solid"
          >
            <IoMdAddCircleOutline className="size-6" />
            Añadir rutina
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`rounded-lg mb-4 p-5 px-3 flex justify-between border border-radixgreen/30`}
          >
            <div className="flex gap-3">
              <TextField.Input
                color={`${errors.name ? "red" : "green"}`}
                {...register("name", {
                  required: "Debes escribir un nombre",
                  validate: { unique: isUnique },
                })}
              ></TextField.Input>
              <span className="text-red-500">{errors.name?.message}</span>
            </div>
            <Button className="">Aceptar</Button>
          </form>
        </Collapsible.Content>
      </Collapsible.Root>
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
