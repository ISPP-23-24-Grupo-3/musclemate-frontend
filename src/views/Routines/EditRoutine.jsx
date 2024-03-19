import {
  Button,
  IconButton,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Section,
  Select,
} from "@radix-ui/themes";
import { useContext, useEffect, useState } from "react";
import { BsQrCodeScan } from "react-icons/bs";
import { CgGym, CgTrash } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Info } from "../../components/Callouts/Callouts";

import PropTypes from "prop-types";
import {
  deleteFromApi,
  getFromApi,
  postToApi,
  putToApi,
} from "../../utils/functions/api";

export const EditRoutine = () => {
  const [routine, setRoutine] = useState({
    name: "",
  });

  const [workouts, set_workouts] = useState([]);
  const [hide_form, set_hide_form] = useState(true);
  const [editing_name, set_editing_name] = useState(false);
  const [equipment, set_equipment] = useState([]);

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
      return fetchedWorkouts.filter((w) =>
        // Array.includes does not cover the case of having string inputs and numbers inside the array
        w.routine.some((r) => r == routineId),
      );
    };
    const fetchRoutine = async (id) => {
      const response = await getFromApi(`routines/`);
      const fetchedRoutines = await response.json();
      const fetchedRoutine = fetchedRoutines.find((r) => r.id == id);
      return fetchedRoutine;
    };
    const fetchEquipment = async () => {
      const response = await getFromApi(`equipments/`);
      const fetchedEquipment = await response.json();
      return fetchedEquipment;
    };

    fetchWorkouts(routineId).then((w) => set_workouts(w));
    fetchRoutine(routineId).then((r) => setRoutine(r));
    fetchEquipment().then((e) => set_equipment(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  const { register, handleSubmit, setValue } = useForm();

  return (
    <>
      <Section className="!pt-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heading className={editing_name ? "hidden" : undefined}>
              {routine.name}
            </Heading>
            <form
              className={`${!editing_name ? "hidden" : undefined} flex gap-5`}
              onSubmit={handleSubmit((r) => {
                updateName(r.name);
                set_editing_name(false);
              })}
            >
              <TextField.Input {...register("name", { required: true })} />
              <Button>Aceptar</Button>
            </form>
            <IconButton
              className={editing_name ? "!hidden" : undefined}
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
            routine={routine}
            equipment={equipment}
          />
          <WorkoutList
            workouts={workouts}
            equipments={equipment}
            set_workouts={set_workouts}
          />
        </Flex>
      </Section>
    </>
  );
};

const WorkoutList = ({ workouts, equipments, set_workouts }) => {
  const deleteWorkout = (workout) => {
    deleteFromApi("workouts/delete/" + workout.id + "/").then((r) => {
      if (r.ok) {
        set_workouts((c_workouts) =>
          c_workouts.filter((w) => w.id != workout.id),
        );
      }
    });
  };

  const getEquipmentName = (equipment_id) => {
    if (equipments.length == 0) return;
    return equipments.find((e) => e.id == equipment_id).name;
  };

  return (
    <>
      {workouts.length == 0 && (
        <Info size="3" message="No tienes ningún ejercicio registrado" />
      )}
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <div className="flex gap-5 items-center">
            <div className="flex justify-between grow">
              <Flex direction="column" className="w-1/5">
                <Text weight="bold">Ejercicio</Text>
                <Text>{workout.name}</Text>
              </Flex>
              <Flex direction="column" className="w-1/5 items-end">
                <Text weight="bold">Máquinas</Text>
                {workout.equipment.map((e) => (
                  <span key={e}>{getEquipmentName(e)}</span>
                ))}
              </Flex>
            </div>
            <IconButton
              size="3"
              radius="full"
              color="red"
              variant="outline"
              onClick={() => deleteWorkout(workout)}
            >
              <CgTrash className="size-6" />
            </IconButton>
          </div>
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

const EditableWorkout = ({
  workouts,
  editWorkout,
  hideForm,
  setHideForm,
  routine,
  equipment,
}) => {
  const addWorkout = (workout) => {
    const parsed_workout = {
      ...workout,
      equipment: workout.equipment.map((e) => e.value),
    };
    const temp_workout = { ...parsed_workout, temp_id: Date.now() };
    editWorkout([temp_workout, ...workouts]);

    postToApi("workouts/create/", parsed_workout)
      .then((r) => r.json())
      .then((postedWorkout) =>
        editWorkout(
          workouts.map((w) =>
            w.temp_id == temp_workout.temp_id ? postedWorkout : w,
          ),
        ),
      )
      .catch(
        editWorkout(workouts.filter((w) => w.temp_id != temp_workout.temp_id)),
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
    control,
    formState: { errors },
  } = useForm({
    values: {
      routine: [routine.id],
      equipment: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipment",
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={hideForm ? "hidden" : undefined}
      >
        <Card>
          <Flex justify="between">
            <Flex direction="column" className="w-1/5">
              <Text weight="bold">Ejercicio</Text>
              <TextField.Input
                name="name"
                {...register("name", { required: true })}
                color={errors.name && "red"}
                className={`${errors.name ? "!border-red-500" : undefined}`}
              ></TextField.Input>
            </Flex>
            <div className="w-1/5 items-end flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <IconButton
                  type="button"
                  radius="full"
                  size="1"
                  onClick={() => append({ value: undefined })}
                >
                  <FaPlus className="size-3" />
                </IconButton>
                <Text weight="bold">Máquina</Text>
              </div>
              {fields.map((f, index) => (
                <Controller
                  key={f.id}
                  control={control}
                  name={`equipment.${index}.value`}
                  render={({ field: { onChange, value, defaultValue } }) => (
                    <Select.Root
                      onValueChange={onChange}
                      value={value}
                      defaultValue={defaultValue}
                    >
                      <Select.Trigger placeholder="Selecciona una máquina" />
                      <Select.Content>
                        {equipment.map((e) => (
                          <Select.Item key={e.id} value={"" + e.id}>
                            {e.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              ))}
            </div>
          </Flex>
          <Button className="!mt-3" type="submit">
            Aceptar
          </Button>
        </Card>
      </form>
    </>
  );
};
