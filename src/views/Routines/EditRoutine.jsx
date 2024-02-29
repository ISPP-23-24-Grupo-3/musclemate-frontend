import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Text,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { BsQrCodeScan } from "react-icons/bs";
import { CgGym } from "react-icons/cg";

import PropTypes from "prop-types";

export const EditRoutine = () => {
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

  const [routine, setRoutine] = useState({
    name: "Routine 1",
    workouts,
  });

  const updateRoutine = (event) =>
    setRoutine({ ...routine, name: event.target.value });

  return (
    <>
      <div className="flex mt-4 justify-between">
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
        <WorkoutList workouts={routine.workouts} />
      </Flex>
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
