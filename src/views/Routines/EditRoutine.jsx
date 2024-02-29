import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

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
      <Flex gap="2">
        <Box>
          <Text>{routine.name}</Text>
        </Box>
        <EditDialog updateRoutine={updateRoutine} />
      </Flex>
      <Card>
        <Heading>Añadir ejercicio</Heading>
        <Flex justify="between">
          <Button variant="outline">Manualmente</Button>
          <Button variant="outline">Escanea con QR</Button>
        </Flex>
      </Card>
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
            <Box>
              <Flex direction="column">
                <Text>Ejercicio</Text>
                <Text>{workout.name}</Text>
              </Flex>
            </Box>
            <Box>
              <Flex direction="column">
                <Text>Sets</Text>
                <Text>{workout.sets}</Text>
              </Flex>
            </Box>
            <Box>
              <Flex direction="column">
                <Text>Repeticiones</Text>
                <Text>{workout.reps}</Text>
              </Flex>
            </Box>
            <Box>
              <Flex direction="column">
                <Text>Peso</Text>
                <Text>{workout.weight}</Text>
              </Flex>
            </Box>
            <Box>
              <Flex direction="column">
                <Text>Máquina</Text>
                <Text>{workout.machine}</Text>
              </Flex>
            </Box>
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
