import {
  Button,
  IconButton,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Section,
} from "@radix-ui/themes";
import { useContext, useEffect, useState } from "react";
import { BsQrCodeScan } from "react-icons/bs";
import { CgGym } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { Info } from "../../components/Callouts/Callouts";

import PropTypes from "prop-types";
import { getFromApi, postToApi, putToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { fetchClient } from "../../utils/functions/fetchUser";

export const EditRoutine = () => {
  const [routine, setRoutine] = useState({
    name: "",
  });

  const [workouts, set_workouts] = useState([]);
  const [hide_form, set_hide_form] = useState(true);
  const [editing_name, set_editing_name] = useState(false);
  const [client, set_client] = useState({});
  const { user } = useContext(AuthContext);
  console.log(client.name);

  const routineId = useParams().id;
  const updateName = (name) => {
    const prevRoutine = { ...routine };
    const tempRoutine = { ...routine, name: name };
    setRoutine({ tempRoutine });
    putToApi("routines/update/" + routine.id + "/", tempRoutine)
      .then((r) => r.json())
      .then((updatedRoutine) => setRoutine(updatedRoutine))
      .catch(setRoutine(prevRoutine));
  };

  useEffect(() => {
    const fetchWorkouts = async (routineId) => {
      const response = await getFromApi("workouts/");
      const fetchedWorkouts = await response.json();
      return fetchedWorkouts.filter((w) => w.routine === routineId);
    };
    const fetchRoutine = async (id) => {
      const response = await getFromApi(`routines/`);
      const fetchedRoutines = await response.json();
      const fetchedRoutine = fetchedRoutines.find((r) => r.id == id);
      return fetchedRoutine;
    };

    fetchWorkouts(routineId).then((w) => set_workouts(w));
    fetchRoutine(routineId).then((r) => setRoutine(r));
    fetchClient(user.username).then((c) => set_client(c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  const { register, handleSubmit, setValue } = useForm();

  return (
    <>
      <Section className="!pt-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heading className={editing_name && "hidden"}>
              {routine.name}
            </Heading>
            <form
              className={`${!editing_name && "hidden"} flex gap-5`}
              onSubmit={handleSubmit((r) => {
                updateName(r.name);
                set_editing_name(false);
              })}
            >
              <TextField.Input {...register("name", { required: true })} />
              <Button>Aceptar</Button>
            </form>
            <IconButton
              className={editing_name && "!hidden"}
              radius="full"
              onClick={() => {
                set_editing_name(true);
                setValue("name", routine.name);
              }}
            >
              <LuPencil />
            </IconButton>
          </div>
          <Button size="3">
            <CgGym className="size-7" />
            Entrenar
          </Button>
        </div>
        <div className="my-4 bg-radixgreen/40 p-4 rounded-lg">
          <Heading className="!mb-2">Añadir ejercicio</Heading>
          <div className="place-content-around gap-20 flex">
            <Button
              className="flex-1"
              variant="surface"
              onClick={() => set_hide_form(false)}
            >
              Manualmente
            </Button>
            <Button className="flex-1" variant="surface">
              <BsQrCodeScan className="size-5" />
              Escanea con QR
            </Button>
          </div>
        </div>
        <Heading as="h2">Ejercicios</Heading>
        <Flex direction="column" gap="3" className="mt-4">
          <EditableWorkout
            workouts={workouts}
            editWorkout={set_workouts}
            hideForm={hide_form}
            setHideForm={set_hide_form}
            client={client}
            routine={routine}
          />
          <WorkoutList workouts={workouts} />
        </Flex>
      </Section>
    </>
  );
};

const WorkoutList = ({ workouts }) => {
  return (
    <>
      <Info message="No tienes ningún ejercicio registrado" />
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <Flex justify="between">
            <Flex direction="column" className="w-1/5">
              <Text weight="bold">Ejercicio</Text>
              <Text>{workout.name}</Text>
            </Flex>
            <div className="flex place-content-around w-3/5">
              <Flex direction="column items-center">
                <Text weight="bold">Sets</Text>
                <Text>{workout.sets}</Text>
              </Flex>
              <Flex direction="column items-center">
                <Text weight="bold">Repeticiones</Text>
                <Text>{workout.reps}</Text>
              </Flex>
              <Flex direction="column items-center">
                <Text weight="bold">Peso</Text>
                <Text>{workout.weight}</Text>
              </Flex>
            </div>
            <Flex direction="column" className="w-1/5 items-end">
              <Text weight="bold">Máquina</Text>
              <Text>{workout.machine}</Text>
            </Flex>
          </Flex>
        </Card>
      ))}
    </>
  );
};

WorkoutList.propTypes = {
  workouts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sets: PropTypes.number,
      reps: PropTypes.number,
      weigth: PropTypes.number,
    })
  ),
};

const EditableWorkout = ({
  workouts,
  editWorkout,
  hideForm,
  setHideForm,
  client,
  routine,
}) => {
  const addWorkout = (workout) => {
    const temp_workout = { ...workout, temp_id: Date.now() };
    editWorkout([temp_workout, ...workouts]);

    postToApi("workouts/create/", workout)
      .then((r) => r.json())
      .then((postedWorkout) =>
        editWorkout(
          workouts.map((w) =>
            w.temp_id == temp_workout.temp_id ? postedWorkout : w
          )
        )
      )
      .catch(
        editWorkout(workouts.filter((w) => w.temp_id != temp_workout.temp_id))
      );
  };

  const onSubmit = (data) => {
    addWorkout(data);

    setHideForm(true);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      client: client.id,
      routine: routine.name,
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={hideForm && "hidden"}>
        <Card>
          <Flex justify="between">
            <Flex direction="column" className="w-1/5">
              <Text weight="bold">Ejercicio</Text>
              <TextField.Input
                name="name"
                {...register("name", { required: true })}
                color={errors.name && "red"}
                className={`${errors.name && "!border-red-500"}`}
              ></TextField.Input>
            </Flex>
            <div className="flex place-content-around w-3/5">
              <Flex direction="column items-center" className="flex-1">
                <Text weight="bold">Sets</Text>
                <TextField.Input
                  type="number"
                  min="0"
                  name="sets"
                  color={errors.sets && "red"}
                  className={`!w-20 ${errors.sets && "!border-red-500"}`}
                  {...register("sets", { required: true })}
                ></TextField.Input>
              </Flex>
              <Flex direction="column items-center" className="flex-1">
                <Text weight="bold">Repeticiones</Text>
                <TextField.Input
                  name="reps"
                  type="number"
                  min="0"
                  color={errors.reps && "red"}
                  className={`!w-20 ${errors.reps && "!border-red-500"}`}
                  {...register("reps", {
                    valueAsNumber: "true",
                    required: true,
                  })}
                ></TextField.Input>
              </Flex>
              <Flex direction="column items-center" className="flex-1">
                <Text weight="bold">Peso</Text>
                <TextField.Input
                  name="weight"
                  type="number"
                  min="0"
                  color={errors.weight && "red"}
                  className={`!w-20 ${errors.weight && "!border-red-500"}`}
                  {...register("weight", {
                    valueAsNumber: true,
                    required: false,
                  })}
                ></TextField.Input>
              </Flex>
            </div>
            <Flex direction="column" className="w-1/5 items-end">
              <Text weight="bold">Máquina</Text>
              <TextField.Input
                name="machine"
                color={errors.machine && "red"}
                className={`${errors.name && "!border-red-500"}`}
                {...register("machine")}
              ></TextField.Input>
            </Flex>
          </Flex>
          <Button className="!mt-3">Finish editing</Button>
        </Card>
      </form>
    </>
  );
};
