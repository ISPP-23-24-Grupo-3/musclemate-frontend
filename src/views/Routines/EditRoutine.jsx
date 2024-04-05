/* eslint react/prop-types: 0 */
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
import { ImCross } from "react-icons/im";
import { useContext, useEffect, useState } from "react";
import { BsQrCodeScan } from "react-icons/bs";
import { CgGym, CgTrash } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Info } from "../../components/Callouts/Callouts";
import AuthContext from "../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import {
  deleteFromApi,
  getFromApi,
  postToApi,
  putToApi,
} from "../../utils/functions/api";
import { FormContainer } from "../../components/Form";

export const EditRoutine = () => {
  const [routine, setRoutine] = useState({
    name: "",
  });

  const [other_workouts, set_other_workouts] = useState([]);
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
      set_other_workouts(
        fetchedWorkouts.filter((w) => w.routine.some((r) => r != routineId)),
      );
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
  const navigate = useNavigate();
  const startRoutine = () =>
    navigate(`/user/routines/${routineId}/workouts`, {
      state: { routineId: routineId },
    });

  return (
    <>
      <Section className="!pt-1">
        <div className="flex justify-around items-center pt-8">
          <div className="flex items-center gap-3 pt-2 mb-3">
            <Heading
              className={`${editing_name ? "hidden" : undefined} text-radixgreen`}
            >
              {routine.name}
            </Heading>
            <form
              className={`${!editing_name ? "hidden" : undefined} flex gap-3`}
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
          <Button size="3" onClick={startRoutine}>
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
              onClick={() => set_hide_form(!hide_form)}
            >
              Manualmente
            </Button>
            <Button className="flex-1" variant="surface">
              <BsQrCodeScan className="size-5" />
              Escanea con QR
            </Button>
          </div>
        </div>
        <Heading as="h2" className="text-radixgreen font-bold">
          Ejercicios
        </Heading>
        <Flex direction="column" gap="3" className="mt-4">
          {!hide_form && (
            <FormContainer>
              <EditableWorkout
                workouts={workouts}
                set_workout={set_workouts}
                hideForm={hide_form}
                setHideForm={set_hide_form}
                routine={routine}
                equipment={equipment}
                other_workouts={other_workouts}
              />
            </FormContainer>
          )}

          <WorkoutList
            workouts={workouts}
            equipments={equipment}
            set_workouts={set_workouts}
            routine={routine}
            other_workouts={other_workouts}
          />
        </Flex>
      </Section>
    </>
  );
};

const WorkoutList = ({
  workouts,
  equipments,
  set_workouts,
  routine,
  other_workouts,
}) => {
  return (
    <>
      {workouts.length == 0 && (
        <Info size="3" message="No tienes ningún ejercicio registrado" />
      )}
      {workouts.map((workout) => (
        <Workout
          workouts={workouts}
          workout={workout}
          key={workout.id}
          set_workouts={set_workouts}
          equipments={equipments}
          routine={routine}
          other_workouts={other_workouts}
        />
      ))}
    </>
  );
};

const Workout = ({
  workouts,
  workout,
  set_workouts,
  equipments,
  routine,
  other_workouts,
}) => {
  const [editing, setEditing] = useState(false);

  const deleteWorkout = (workout) => {
    deleteFromApi("workouts/delete/" + workout.id + "/").then((r) => {
      if (r.ok) {
        set_workouts((c_workouts) =>
          c_workouts.filter((w) => w.id != workout.id),
        );
      }
    });
  };

  return (
    <Card key={workout.id}>
      <div className="flex gap-5 items-center">
        <div className="flex justify-between grow">
          {!editing ? (
            <WorkoutInfo workout={workout} equipments={equipments} />
          ) : (
            <EditableWorkout
              workouts={workouts}
              defaultWorkout={workout}
              set_workout={set_workouts}
              routine={routine}
              equipment={equipments}
              setHideForm={setEditing}
              hideForm={false}
              other_workouts={other_workouts}
            />
          )}
        </div>
        <IconButton
          variant="surface"
          radius="full"
          onClick={() => setEditing(!editing)}
        >
          <LuPencil className="size-4" />
        </IconButton>
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

const WorkoutInfo = ({ workout, equipments }) => {
  const getEquipmentName = (equipment_id) => {
    if (equipments.length == 0) return;
    return equipments?.find((e) => e.id == equipment_id).name || "";
  };

  return (
    <>
      <Flex direction="column" className="w-1/5">
        <Text style={{ fontStyle: "italic" }}>Nombre</Text>
        <Text weight="bold" style={{ fontSize: 22 }}>
          {workout.name}
        </Text>
      </Flex>
      <Flex direction="column" className="w-1/5 items-end">
        <Text weight="bold">Máquinas</Text>
        {workout.equipment &&
          workout.equipment.map((e) => (
            <span key={e}>{getEquipmentName(e)}</span>
          ))}
      </Flex>
    </>
  );
};

const EditableWorkout = ({
  workouts,
  set_workout,
  hideForm,
  setHideForm,
  routine,
  equipment,
  defaultWorkout,
  other_workouts,
}) => {
  const { user } = useContext(AuthContext); // Obtenemos la información del usuario del contexto de autorización

  const [clientId, setClientId] = useState(null);
  const clientUsername = user?.username;

  useEffect(() => {
    if (clientUsername) {
      getFromApi("clients/detail/" + clientUsername + "/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setClientId(data.id);
        });
    }
  }, [clientUsername]);

  const addWorkout = (workout) => {
    const parsed_workout = {
      ...workout,
      equipment: workout.equipment.map((e) => Number(e.value)),
      client: clientId, // Asignamos el ID del usuario al workout
    };
    const temp_workout = {
      ...parsed_workout,
      temp_id: Date.now(),
      id: Date.now(),
    };
    set_workout([temp_workout, ...workouts]);

    postToApi("workouts/create/", parsed_workout)
      .then(async (r) => {
        if (r.ok) {
          return await r.json();
        }
        throw r;
      })
      .then((postedWorkout) =>
        set_workout((c_workouts) =>
          c_workouts.map((w) =>
            w.temp_id == temp_workout.temp_id ? postedWorkout : w,
          ),
        ),
      )
      .catch((e) => {
        set_workout((c_workouts) =>
          c_workouts.filter((w) => w.temp_id != temp_workout.temp_id),
        );
      });
  };

  const editWorkout = (workout, id) => {
    const parsed_workout = {
      ...workout,
      equipment:
        Array.isArray(workout.equipment) && workout.equipment.length
          ? workout.equipment
              .map((e) => Number(e.value))
              .filter((e) => !isNaN(e) && e !== null).length
            ? workout.equipment
                .map((e) => Number(e.value))
                .filter((e) => !isNaN(e) && e !== null)
            : []
          : [],
      client: clientId,
    };
    const temp_workout = { ...parsed_workout, temp_id: Date.now() };

    set_workout((c_workouts) =>
      // The list component uses the ID as key, so it needs to be given
      c_workouts.map((w) => (w.id == id ? { ...temp_workout, id: id } : w)),
    );

    putToApi(`workouts/update/${id}/`, parsed_workout)
      .then(async (r) => {
        if (r.ok) {
          return await r.json();
        }
        throw r;
      })
      .then((updatedWorkout) => {
        set_workout((c_workouts) =>
          c_workouts.map((w) =>
            w.temp_id == temp_workout.temp_id ? updatedWorkout : w,
          ),
        );
      })
      .catch((e) => {
        set_workout((c_workouts) =>
          c_workouts.map((w) =>
            w.temp_id == temp_workout.temp_id
              ? { ...parsed_workout, id: id }
              : w,
          ),
        ),
          console.log("error: ", e);
      });
  };

  const hasUniqueName = (name) => {
    const allWorkouts = [...workouts, ...other_workouts];
    return (
      !allWorkouts.some((w) => w.name == name && defaultWorkout != w) ||
      "Ya tienes un ejercicio con ese nombre"
    );
  };

  const onSubmit = (data) => {
    defaultWorkout ? editWorkout(data, defaultWorkout.id) : addWorkout(data);

    setHideForm((c) => !c);
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
      name: defaultWorkout?.name,
      equipment: Array.isArray(defaultWorkout?.equipment)
        ? defaultWorkout?.equipment.length > 1
          ? defaultWorkout?.equipment.map((e) => ({ value: e + "" }))
          : { value: defaultWorkout?.equipment[0] + "" }
        : [],
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full ${hideForm ? "hidden" : ""}`}
      >
        <Flex justify="between">
          <Flex direction="column" className="w-1/5">
            <Text weight="bold">Ejercicio</Text>
            <TextField.Input
              name="name"
              {...register("name", {
                required: "Debes escribir un nombre",
                validate: {
                  unique: hasUniqueName,
                  maxLength: (value) =>
                    value.length <= 100 ||
                    "El valor no puede tener más de 100 caracteres",
                },
              })}
              color={errors.name && "red"}
              className={`${errors.name ? "!border-red-500" : undefined}`}
            ></TextField.Input>
          </Flex>
          <div className="w-1/5 items-end flex flex-col gap-2">
            <EquipmentSelect equipment={equipment} control={control} />
          </div>
        </Flex>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Aceptar</Button>
          <span className="text-red-500">{errors.name?.message}</span>
        </div>
      </form>
    </>
  );
};

const EquipmentSelect = ({ equipment, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipment",
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <IconButton
          type="button"
          radius="full"
          size="1"
          onClick={() => append({ value: undefined })}
        >
          <FaPlus className="size-3" />
        </IconButton>
        <Text weight="bold">Máquinas</Text>
      </div>
      {fields.map((f, index) => (
        <div key={f.id} className="flex items-center gap-3">
          <Controller
            control={control}
            name={`equipment.${index}.value`}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value}>
                <Select.Trigger placeholder="Selecciona una máquina" />
                <Select.Content>
                  {equipment.map((e) => (
                    <Select.Item key={e.id} value={e.id.toString()}>
                      {e.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          />
          <IconButton
            radius="full"
            size="1"
            color="red"
            variant="ghost"
            onClick={() => remove(index)}
          >
            <ImCross className="size-2.5" />
          </IconButton>
        </div>
      ))}
    </>
  );
};
