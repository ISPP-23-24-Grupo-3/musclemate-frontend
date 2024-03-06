import {
  Button,
  IconButton,
  Card,
  Dialog,
  Flex,
  Heading,
  Text,
  TextField,
  Section,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { BsQrCodeScan } from "react-icons/bs";
import { CgGym } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { Info } from "../../components/Callouts/Callouts";

import PropTypes from "prop-types";
import { getFromApi } from "../../utils/functions/api";

const workouts = [
  {
    id: 1,
    name: "Press de banca",
    sets: 4,
    reps: 3,
    weight: 12,
    machine: "Press de banca",
  },
  {
    id: 2,
    name: "Extensiones de triceps",
    sets: 4,
    reps: 3,
    weight: 24,
    machine: "Polea",
  },
];

export const EditRoutine = () => {
  const [routine, setRoutine] = useState({
    name: "",
    workouts: [],
  });
  const [hide_form, set_hide_form] = useState(true);
  const [editing_name, set_editing_name] = useState(false);

  const routineId = useParams().id;
  const updateName = (name) => setRoutine({ ...routine, name: name });
  const updateWorkouts = (workouts) =>
    setRoutine({ ...routine, workouts: workouts });

  useEffect(() => {
    const fetchWorkouts = async (routineId) => {
      const response = await getFromApi("workouts/");
      const fetchedWorkouts = await response.json();
      return fetchedWorkouts.filter((w) => w.routine === routineId);
    };

    fetchWorkouts(routineId).then((w) => updateWorkouts(w));
  });

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
            workouts={routine.workouts}
            editWorkout={updateWorkouts}
            hideForm={hide_form}
            setHideForm={set_hide_form}
          />
          <WorkoutList workouts={routine.workouts} />
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
    }),
  ),
};

const EditableWorkout = ({ workouts, editWorkout, hideForm, setHideForm }) => {
  const onSubmit = (data) => {
    editWorkout([data, ...workouts]);
    setHideForm(true);
    reset();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
