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
import { ImCross } from "react-icons/im";
import { useContext, useEffect, useState } from "react";
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
import { EquipmentSelect } from "../../components/Equipments";

export const EditRoutine = () => {
  const [routine, setRoutine] = useState({
    name: "",
  });

  const [other_workouts, set_other_workouts] = useState([]);
  const [workouts, set_workouts] = useState([]);
  const [hide_form, set_hide_form] = useState(true);
  const [editing_name, set_editing_name] = useState(false);
  const [equipment, set_equipment] = useState([]);
  const [routines, setRoutines] = useState([]);

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

    const fetchRoutines = async () => {
      const response = await getFromApi("routines/");
      const fetchedRoutines = await response.json();
      return fetchedRoutines;
    };

    fetchRoutines()
      .then((r) => setRoutines(r));

    const fetchWorkouts = async (routineId) => {
      const response = await getFromApi("workouts/byRoutine/"+routineId+"/");
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
      try {
        const response = await getFromApi(`routines/detail/`+id+`/`);
        if (!response.ok) {
          throw new Error("No tienes permisos para acceder a esta rutina.");
        }
        const fetchedRoutine = await response.json();
        return fetchedRoutine;
      } catch (error) {
        window.alert(error.message);
      }
    };
    const fetchEquipment = async () => {
      const response = await getFromApi(`equipments/`);
      const fetchedEquipment = await response.json();
      return fetchedEquipment;
    };

    fetchWorkouts(routineId).then((w) => set_workouts(w));
    fetchRoutine(routineId)
      .then((r) => setRoutine(r))
      .catch((error) => {
      });
    fetchEquipment().then((e) => set_equipment(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  const { register, handleSubmit, setValue, formState: { errors }} = useForm()
  const navigate = useNavigate();
  const startRoutine = () => navigate(`/user/routines/${routineId}/workouts`, { state: { routineId: routineId } });
  const hasUniqueNameRoutine = (routineName, currentRoutine) => {
    return (
      routines.every((r) => {
        // Excluye la comparación si estamos editando la rutina con el mismo nombre
        return currentRoutine && r.name === currentRoutine.name ? true : routineName !== r.name;
      }) || "Ya tienes una rutina con ese nombre"
    );
  };

  return (
    <>
      <Section className="!pt-1">
        <div className="flex justify-around items-center pt-8">
          <div className="flex items-center gap-3 pt-2 mb-3">
            <Heading className={`${editing_name ? "hidden" : undefined} text-radixgreen`}>
              {routine.name}
            </Heading>
            <form
              className={`${!editing_name ? "hidden" : undefined} flex gap-3`}
              onSubmit={handleSubmit((r) => {
                updateName(r.name);
                set_editing_name(false);
              })}
              >
              <TextField.Input
                name="name"
                {...register("name", {
                  required: "Debes escribir un nombre",
                  validate: {
                    unique: hasUniqueNameRoutine,
                    maxLength: value => value.length <= 100 || 'El valor no puede tener más de 100 caracteres'
                  },
                })}
                color={errors.name ? "red" : undefined}
                className={`${errors.name ? "!border-red-500" : undefined}`}
                >
              </TextField.Input>
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
          <button
            className="my-4 p-4 rounded-lg flex items-center gap-3 bg-green-100 cursor-pointer focus:outline-none"
            onClick={() => set_hide_form(false)}
            >
             <FaPlus className="text-gray-700 size-5" />
            <Heading as="h2" className="text-black font-bold flex-grow">Añadir Ejercicios</Heading>
          </button>

          <Button size="3" onClick={startRoutine}>
            <CgGym className="size-7"/>
            Entrenar
          </Button>
        </div>
        <Heading as="h2" className="text-radixgreen font-bold">Ejercicios</Heading>
        
        <Flex direction="column" gap="3" className="mt-4">
            <EditableWorkout
              workouts={workouts}
              set_workout={set_workouts}
              hideForm={hide_form}
              setHideForm={set_hide_form}
              routine={routine}
              equipment={equipment}
              other_workouts={other_workouts}
            />
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
        <Info size="3" message="Aún no tienes ningún ejercicio registrado" />
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
      if (
        window.confirm(
          `¿Estás seguro de que deseas borrar el ejercicio "${workout.name}"?`,
        )
      ){
    deleteFromApi("workouts/delete/" + workout.id + "/").then((r) => {
      if (r.ok) {
        set_workouts((c_workouts) =>
          c_workouts.filter((w) => w.id != workout.id),
        );
      }
    });
  };}

  return (
    
      <div className="flex gap-5 bg-radixgreen/10 items-center p-4 justify-between rounded-lg">
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
    if (!equipments || equipments.length === 0) return '';
    const equipment = equipments.find((e) => e.id === equipment_id);
    return equipment ? equipment.name : '';
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
  equipment,
  routine,
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

    const definedEquipment = workout.equipment
    ? workout.equipment
        .filter((e) => e.value !== undefined) // Filtrar los equipos definidos
        .map((e) => Number(e.value))
    : [];
    console.log(definedEquipment)
    const parsed_workout = {
      ...workout,
      client: clientId, // Asignamos el ID del usuario al workout
      equipment: definedEquipment.length > 0 ? definedEquipment : undefined,
    };
    console.log(parsed_workout)
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
    const uniqueEquipmentSet = new Set();
    // Agregar equipos definidos al conjunto
    data.equipment.forEach(e => {
      if (e.value !== undefined) {
        uniqueEquipmentSet.add(e.value);
      }
    });

    // Convertir el conjunto nuevamente a una lista
    const uniqueEquipment = Array.from(uniqueEquipmentSet);

    // Conservar solo un equipo indefinido si hay varios
    if (uniqueEquipmentSet.size==0) {
      uniqueEquipment.push(undefined);
    }

    // Actualizar los datos con los equipos únicos
    data.equipment = uniqueEquipment.map(value => ({ value }));

    // Enviar los datos para agregar o editar el ejercicio
    defaultWorkout ? editWorkout(data, defaultWorkout.id) : addWorkout(data);

    // Ocultar el formulario y restablecer los valores
    setHideForm(c => !c);
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
      equipment: defaultWorkout?.equipment 
      ? defaultWorkout.equipment.map((e) => ({ value: e + "" }))
      : [{ value: undefined }],
    },
  });
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full ${hideForm ? "hidden" : ""} 
          rounded-lg mb-4 p-5 px-3 justify-between border border-radixgreen/30`}
      >
        <Flex justify="between">
          <Flex direction="column" className="w-1/5">
            <span>Nombre del ejercicio</span>
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
            <EquipmentSelect/>
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
