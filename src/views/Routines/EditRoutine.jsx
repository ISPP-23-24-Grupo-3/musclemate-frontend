import {
  Button,
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

import PropTypes from "prop-types";

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
    name: "Routine 1",
    workouts,
  });

  const updateRoutine = (event) =>
    setRoutine({ ...routine, name: event.target.value });

  return (
    <>
      <Section className="!pt-1">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Heading>{routine.name}</Heading>
            <EditDialog updateRoutine={updateRoutine} />
          </div>
          <Button size="3">
            <CgGym className="size-7" />
            Entrenar
          </Button>
        </div>
        <div className="my-4 bg-radixgreen/40 p-4 rounded-lg">
          <Heading className="!mb-2">Añadir ejercicio</Heading>
          <div className="place-content-around gap-20 flex">
            <Button className="flex-1" variant="surface">
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
          <EditableWorkout workout={{}} />
          <WorkoutList workouts={routine.workouts} />
        </Flex>
      </Section>
    </>
  );
};

const EditDialog = ({ updateRoutine }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="1">Editar nombre</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <TextField.Input
          placeholder="Nombre de la rutina"
          onChange={updateRoutine}
        ></TextField.Input>
        <Text>Hola</Text>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const WorkoutList = ({ workouts }) => {
  return (
    <>
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

const EditableWorkout = ({ workout }) => {
  const editing = !workout.id;

  const onSubmit = (data) => {
    console.log("Submitted");
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Flex justify="between">
            <Flex direction="column" className="w-1/5">
              <Text weight="bold">Ejercicio</Text>
              <TextField.Input
                value={workout.name}
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
                  value={workout.sets}
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
                  value={workout.reps}
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
                  value={workout.weight}
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
                value={workout.machine}
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
