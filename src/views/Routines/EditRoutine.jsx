import {
  Button,
  IconButton,
  Flex,
  Heading,
  Text,
  TextField,
  Section,
  Select,
} from "@radix-ui/themes";
import { IoMdFitness } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { useContext, useEffect, useRef, useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { LuPencil, LuPlusCircle } from "react-icons/lu";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Info } from "../../components/Callouts/Callouts";
import { EquipmentSelect } from "../../components/Equipments";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import {
  deleteFromApi,
  getFromApi,
  postToApi,
  putToApi,
} from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

export const EditRoutine = () => {
  const [routine, setRoutine] = useState({
    name: "",
  });
  const [routineNames, setRoutineNames] = useState([]);

  const routineId = useParams().id;

  useEffect(() => {
    const fetchRoutines = async () => {
      const response = await getFromApi("routines/");
      const fetchedRoutines = await response.json();
      return fetchedRoutines;
    };

    fetchRoutines().then((data) => {
      const current = data.find((r) => r.id == routineId);
      setRoutine(current);
      setRoutineNames(data.filter((r) => r.id != routineId).map((r) => r.name));
    });
  }, [routineId]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Heading as="h1" className="text-radixgreen">
            Editar Rutina
          </Heading>
          <Button>
            <IoMdFitness className="size-5 -rotate-45" />
            Entrenar
          </Button>
        </div>
        <RoutineName routine={routine} setRoutine={setRoutine} />
        <WorkoutList routineId={routineId} />
      </div>
    </>
  );
};

const RoutineName = ({ routine, setRoutine, names }) => {
  const [edit, setEdit] = useState(false);
  const { register, handleSubmit } = useForm();
  const inputRef = useRef(null);

  const updateName = (formData) => {
    const prevRoutine = { ...routine };
    const tempRoutine = { ...routine, name: formData.name };
    setRoutine({ tempRoutine });
    putToApi("routines/update/" + routine.id + "/", tempRoutine)
      .then((r) => r.json())
      .then((updatedRoutine) => setRoutine(updatedRoutine))
      .catch(setRoutine(prevRoutine));
    setEdit(false);
  };

  return (
    <div className="flex gap-3 items-center">
      {edit ? (
        <form onSubmit={handleSubmit(updateName)}>
          <TextField.Input
            {...register("name")}
            autoFocus
            defaultValue={routine.name}
            onFocus={(e) => e.currentTarget.select()}
          />
        </form>
      ) : (
        <Heading as="h2" size="5" onDoubleClick={() => setEdit(true)}>
          {routine.name}
        </Heading>
      )}

      <IconButton radius="full" onClick={() => setEdit(!edit)}>
        <LuPencil />
      </IconButton>
    </div>
  );
};

RoutineName.propTypes = {
  routine: PropTypes.object,
  setRoutine: PropTypes.func,
  names: PropTypes.array,
};

const WorkoutList = ({ routineId }) => {
  const [workouts, setWorkouts] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const { user } = useContext(AuthContext);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    if (user) {
      getFromApi("clients/detail/" + user.username + "/")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setClientId(data.id);
        });
    }
  }, [user]);

  useEffect(() => {
    const fetchWorkouts = async (id) => {
      const response = await getFromApi("workouts/byRoutine/" + id + "/");
      return await response.json();
    };

    fetchWorkouts(routineId).then((data) => setWorkouts(data));
  }, [routineId]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const response = await getFromApi("equipments/");
      return await response.json();
    };

    fetchEquipment().then((data) => setEquipment(data));
  }, []);

  const hasUniqueName = (workout) => {
    return !workouts.some((w) => w.name == workout.name && w.id != workout.id);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => {
          setWorkouts([
            {
              name: "Nuevo ejercicio",
              temp_id: Date.now(),
              equipment: [undefined],
            },
            ...workouts,
          ]);
        }}
      >
        <FaPlus />
        Añadir ejercicio
      </Button>
      {workouts.map((w, index) => (
        <EditableWorkout
          key={index}
          workout={w}
          setWorkouts={setWorkouts}
          equipment={equipment}
          routineId={routineId}
          clientId={clientId}
          uniqueNameChecker={hasUniqueName}
        />
      ))}
    </div>
  );
};

const EditableWorkout = ({
  workout,
  setWorkouts,
  equipment,
  routineId,
  clientId,
  uniqueNameChecker,
}) => {
  const [edit, setEdit] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      routine: [routineId],
      name: workout?.name,
      client: clientId,
      equipment: workout?.equipment
        ? workout.equipment.map((e) => ({ value: e }))
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "equipment",
  });

  const getEquipmentName = (equipment_id) => {
    if (!equipment || equipment.length == 0) return "";
    const eq = equipment.find((e) => e.id == equipment_id);
    return eq ? eq.name : "";
  };

  const deleteWorkout = (workout) => {
    if (!workout.id) {
      setWorkouts((c_workouts) => c_workouts.filter((w) => w !== workout));
      return;
    }
    if (
      window.confirm(
        `¿Estás seguro de que deseas borrar el ejercicio "${workout.name}"?`,
      )
    ) {
      deleteFromApi("workouts/delete/" + workout.id + "/").then((r) => {
        if (r.ok) {
          setWorkouts((c_workouts) =>
            c_workouts.filter((w) => w.id != workout.id),
          );
        }
      });
    }
  };

  const addWorkout = (newWorkout) => {
    const definedEquipment = newWorkout.equipment
      ? [
          ...new Set(
            newWorkout.equipment
              .filter((e) => e.value != undefined) // Filtrar los equipos definidos
              .map((e) => e.value),
          ),
        ]
      : [];
    const parsed_workout = {
      ...newWorkout,
      equipment: definedEquipment.length > 0 ? definedEquipment : undefined,
    };

    postToApi("workouts/create/", parsed_workout)
      .then(async (r) => {
        if (r.ok) {
          return await r.json();
        }
        throw r;
      })
      .then((postedWorkout) =>
        setWorkouts((c_workouts) =>
          c_workouts.map((w) =>
            w.temp_id == workout.temp_id ? postedWorkout : w,
          ),
        ),
      )
      .catch((e) => {
        setWorkouts((c_workouts) =>
          c_workouts.map((w) => (w.temp_id == workout.temp_id ? workout : w)),
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
    };
    const temp_workout = { ...parsed_workout, temp_id: Date.now() };

    setWorkouts((c_workouts) =>
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
        setWorkouts((c_workouts) =>
          c_workouts.map((w) =>
            w.temp_id == temp_workout.temp_id ? updatedWorkout : w,
          ),
        );
      })
      .catch((e) => {
        setWorkouts((c_workouts) =>
          c_workouts.map((w) =>
            w.temp_id == temp_workout.temp_id
              ? { ...parsed_workout, id: id }
              : w,
          ),
        ),
          console.log("error: ", e);
      });
  };

  const onSubmit = (data) => {
    if (!workout.id) {
      addWorkout(data);
    } else {
      editWorkout(data, workout.id);
    }
    setEdit(false);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-radixgreen/10 rounded-lg p-3 flex flex-col gap-1"
    >
      <div className="flex justify-between items-center">
        {!edit && workout.id ? (
          <Text weight="bold" size="3">
            {workout.name}
          </Text>
        ) : (
          <TextField.Input
            {...register("name", {
              required: "Debes escribir un nombre",
              validate: {
                unique: (name) =>
                  uniqueNameChecker({ id: workout.id, name }) ||
                  "Ya tienes un ejercicio con ese nombre",
              },
            })}
            defaultValue={workout.name}
          />
        )}
        <div className="flex gap-2 items-center">
          {(edit || !workout.id) && (
            <IconButton radius="full" size="2" type="submit">
              <FaCheck />
            </IconButton>
          )}
          {workout.id && (
            <IconButton
              radius="full"
              size="2"
              type="button"
              onClick={() => setEdit(!edit)}
            >
              <LuPencil />
            </IconButton>
          )}
          <IconButton
            radius="full"
            size="2"
            color="red"
            type="button"
            onClick={() => deleteWorkout(workout)}
          >
            <ImCross className="size-3" />
          </IconButton>
        </div>
      </div>
      <Text color="red">{errors.name?.message}</Text>
      {((workout.equipment && workout.equipment.length > 0) || edit) && (
        <div className="flex items-stretch rounded-lg border-2 border-radixgreen/40 overflow-hidden">
          {!edit && workout.id ? (
            <div className="bg-radixgreen/20 p-2 flex items-center">
              <IoMdFitness className="size-5 -rotate-45" />
            </div>
          ) : (
            <div className="flex">
              <IconButton
                radius="none"
                type="button"
                className="!h-full"
                onClick={() => append({})}
              >
                <FaPlus />
              </IconButton>
            </div>
          )}
          <div className="flex flex-col flex-grow divide-y divide-radixgreen/30">
            {!edit && workout.id
              ? workout.equipment.map((e) => (
                  <Text key={e} className="p-1 px-2">
                    {getEquipmentName(e)}
                  </Text>
                ))
              : fields.map((f, index) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 px-2 p-1 overflow-hidden justify-between"
                  >
                    <EquipmentSelect
                      {...register(`equipment.${index}.value`)}
                      variant="ghost"
                      radius="none"
                      size="3"
                      className="!flex-grow"
                      equipment={equipment}
                      defaultValue={
                        workout.id
                          ? workout.equipment[index]?.toString()
                          : undefined
                      }
                    />
                    <IconButton
                      variant="ghost"
                      color="red"
                      radius="full"
                      size="2"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <ImCross />
                    </IconButton>
                  </div>
                ))}
          </div>
        </div>
      )}
    </form>
  );
};

EditableWorkout.propTypes = {
  workout: PropTypes.object,
  editWorkout: PropTypes.func,
};
