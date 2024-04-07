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
import { CgGym, CgSpinner, CgTrash } from "react-icons/cg";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Error, Info } from "../../components/Callouts/Callouts";
import { useForm } from "react-hook-form";
import { FormContainer } from "../../components/Form";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  getFromApi,
  postToApi,
  deleteFromApi,
} from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

export const Routines = () => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [routines, setRoutines] = useState([]);
  const [gymPlan, setGymPlan] = useState("");

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

  useEffect(() => {
    if (user) {
        getFromApi("clients/detail/" + user.username + "/") 
            .then((response) => response.json())
            .then((data) => {
              let gym = data.gym;
              getFromApi("gyms/detail/" + gym + "/") 
              .then((response) => response.json())
              .then((data) => {
                setGymPlan(data.subscription_plan);
              });
            });
    }
  }, [user]);

  return (
    <Section className="md:m-0 m-5">
      <div className="flex mb-3 justify-between">
        <Heading size="8" className="text-radixgreen text-center md:text-left">
          Mis Rutinas
        </Heading>
      </div>
  
      {gymPlan === "free" ? (
        <div className="text-red-700 text-center mb-4">
          La subscripción "{gymPlan}" de tu gimnasio no incluye esta funcionalidad. ¡Contacta con tu gimnasio para adquirir funcionalidades como esta!
        </div>
      ) : (
        <>
          <RoutineForm set_routines={setRoutines} routines={routines} />
  
          {error ? (
            <Error message={error} size="3" />
          ) : (
            <ListRoutines routines={routines} set_routines={setRoutines} />
          )}
        </>
      )}
    </Section>
  );
};

const ListRoutines = ({ routines, set_routines }) => {
  const navigate = useNavigate();
  const editRoutine = (routine) => navigate("/user/routines/" + routine.id);
  const startRoutine = (routine) =>
    navigate(`/user/routines/${routine.id}/workouts`, {
      state: { routineId: routine.id },
    });
  const deleteRoutine = (routine) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas borrar la rutina "${routine.name}"?`,
      )
    ) {
      deleteFromApi(`routines/delete/${routine.id}/`).then(
        set_routines((c_routines) =>
          c_routines.filter((r) => r.name !== routine.name),
        ).catch(() => {}),
      );
    }
  };

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
          size="4"
          className="flex bg-radixgreen/10 items-center p-4 justify-between rounded-lg"
        >
          <span className="flex gap-3 items-center">
            <Text style={{ textOverflow: "ellipsis" }} size="5" weight="bold">
              {routine.name}
            </Text>
            {routine.temp_id && <CgSpinner className="size-6 animate-spin" />}
          </span>
          <span className="flex gap-3">
            <IconButton
              size="3"
              radius="full"
              onClick={() => startRoutine(routine)}
            >
              <CgGym className="size-6 rotate-30" />
            </IconButton>
            <IconButton
              size="3"
              radius="full"
              onClick={() => editRoutine(routine)}
            >
              <LuPencil className="size-5" />
            </IconButton>
            <IconButton
              size="3"
              radius="full"
              color="red"
              onClick={(e) => {
                deleteRoutine(routine);
                e.stopPropagation();
              }}
            >
              <CgTrash className="size-6" />
            </IconButton>
          </span>
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
          <span
            className="w-full flex items-center justify-center bg-radixgreen rounded-lg p-3 mb-5 hover:bg-radixgreen/50 text-white text-lg"
            type="submit"
          >
            <IoMdAddCircleOutline className="size-6" />
            Añadir rutina
          </span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <FormContainer className="mb-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`flex justify-between`}
            >
              <div className="flex flex-col gap-1">
                <span>Nombre de la rutina</span>
                <TextField.Input
                  color={`${errors.name ? "red" : "green"}`}
                  {...register("name", {
                    required: "Debes escribir un nombre",
                    validate: { unique: isUnique },
                  })}
                ></TextField.Input>
                <span className="text-red-500">{errors.name?.message}</span>
              </div>
              <Button className="self-end">Aceptar</Button>
            </form>
          </FormContainer>
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
