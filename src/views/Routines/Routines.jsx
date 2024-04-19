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
import { useRef } from "react";
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
  const [routineCreated, setRoutineCreated] = useState(false);
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [routines, setRoutines] = useState([]);
  const [workouts, set_workouts] = useState([]);
  const [gymPlan, setGymPlan] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await getFromApi("workouts/");
      const fetchedWorkouts = await response.json();
      return fetchedWorkouts;
    };

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
    fetchWorkouts().then((w) => set_workouts(w));
  }, [routineCreated]);

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
    <>
      <div className="flex mb-3 justify-between">
        <Heading size="8" className="text-radixgreen text-center md:text-left">
          Mis Rutinas
        </Heading>
      </div>

      {gymPlan === "free" ? (
        <div className="text-red-700 text-center mb-4">
          La subscripción "{gymPlan}" de tu gimnasio no incluye esta
          funcionalidad. ¡Contacta con tu gimnasio para adquirir funcionalidades
          como esta!
        </div>
      ) : (
        <>
          <RoutineForm set_routines={setRoutines} routines={routines} set_routine_created={setRoutineCreated}
            routine_created={routineCreated} />

          {error ? (
            <Error message={error} size="3" />
          ) : (
            <ListRoutines
              routines={routines}
              set_routines={setRoutines}
              workouts={workouts}
            />
          )}
        </>
      )}
    </>
  );
};

const ListRoutines = ({ routines, set_routines, workouts }) => {
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
      deleteFromApi(`routines/delete/${routine.id}/`)
      .then(() => {
        set_routines((c_routines) =>
          c_routines.filter((r) => r.id !== routine.id)
        );
      })
      .catch((error) => {
        console.error("Error al borrar la rutina:", error);
      });
    }
  };

  if (routines.length === 0) {
    return (
      <Info size="3" message="Aún no tienes rutinas creadas para mostrar" />
    );
  }

  const getWorkoutsLength = (routineId) => {
    let workoutLenght = 0;
    for (const workout of workouts) {
      if (workout.routine == routineId) {
        workoutLenght += 1;
      }
    }
    return workoutLenght;
  };

  return (
    <Flex gap="4" direction="column">
      {routines.map((routine) => (
        <div
          key={routine.id}
          size="4"
          className="flex bg-radixgreen/10 items-center p-4 justify-between rounded-lg"
        >
          <Flex direction="column">
            <Text
              wrap="nowrap"
              style={{ textOverflow: "ellipsis", fontWeight: "bold" }}
              size="5"
            >
              {routine.name}
            </Text>
            {routine.temp_id && <CgSpinner className="size-6 animate-spin" />}
            <Text color="gray" size="2">
              {getWorkoutsLength(routine.id)} ejercicios
            </Text>
          </Flex>
          <span className="flex gap-2 md:gap-5">
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

const RoutineForm = ({ set_routines, routines,set_routine_created,routine_created }) => {
  const [showForm, setShowForm] = useState(false);
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
    postToApi("routines/create/", data)
      .then(async (response) => {
        if (response.ok) {
          const newRoutine = await response.json();
          const routinesWithKeys = [
            ...routines,
            { ...newRoutine, id: Date.now() }
          ];
          set_routines(routinesWithKeys);
          set_routine_created(!routine_created)
          setShowForm(false);
          reset();
        } else {
          throw new Error("Failed to create routine");
        }
      })
      .catch((error) => {
        console.error("Error al crear la rutina:", error);
      });
  };

  return (
    <>
          <span
            className="w-full flex items-center justify-center bg-radixgreen rounded-lg p-3 mb-5 hover:bg-radixgreen/90 text-white text-lg"
            type="submit"
            onClick={() => setShowForm(!showForm)}
          >
            <IoMdAddCircleOutline className="size-6" />
            Añadir rutina
          </span>
        
        {showForm && (
            <FormContainer className="mb-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`flex justify-between flex-wrap gap-3 flex-col sm:flex-row`}
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
        )}
    
    </>
  );
};

ListRoutines.propTypes = {
  routines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
