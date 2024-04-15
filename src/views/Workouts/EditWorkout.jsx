import React, { useEffect, useState } from 'react';
import { getFromApi } from '../../utils/functions/api';
import {Heading,Flex} from "@radix-ui/themes";
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { FormContainer } from "../../components/Form";
import { Series as SerieForm } from "../../components/Series/Series";
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

const EditWorkout = () => {
  const [hideForms, setHideForms] = useState([]);
  const params = useParams();
  const routineId = params.routineId;
  const [nombre, setNombre] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [equipoNames, setEquipoNames] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await getFromApi(`workouts/byRoutine/${routineId}/`);
        if (response.ok) {
          const data = await response.json();
          setWorkouts(data);
          setApiDataLoaded(true);
        } else {
          console.error('Error fetching API workouts:', response.status);
        }
      } catch (error) {
        console.error('Error fetching API workouts:', error);
      }
    };

    fetchWorkouts();
  }, [routineId]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await getFromApi(`routines/detail/${routineId}/`);
        if (response.ok) {
          const data = await response.json();
          setNombre(data.name);
        } else {
          console.error('Error fetching API routine:', response.status);
        }
      } catch (error) {
        console.error('Error fetching API routine:', error);
      }
    };
    fetchRoutine();
  }, [routineId]);

  const equipoN = async (equipo) => {
    let equipoName = [];
    if (equipo) {
      const response = await getFromApi("equipments/detail/"+ Number(equipo) +"/");
      const data = await response.json();
      equipoName.push(data.name);
    }
    equipoName = equipoName.join(", ");
    return equipoName;
  };

  useEffect(() => {
    const fetchEquipoNames = async () => {
      const newEquipoNames = {};
      for (let i = 0; i < workouts.length; i++) {
        const equipoNamesForWorkout = await Promise.all(workouts[i].equipment.map(equipoN));
        newEquipoNames[workouts[i].id] = equipoNamesForWorkout.join(", ");
      }
      setEquipoNames(newEquipoNames);
    };
  
    fetchEquipoNames();
  }, [workouts]);

  const toggleFormVisibility = (workoutId) => {
    setHideForms((prevHideForms) => ({
      ...prevHideForms,
      [workoutId]: !prevHideForms[workoutId] // Cambiar el estado de visibilidad del formulario
    }));
  };

  return (
    <>
      <div className="mx-auto mt-8 m-5 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <Link to={`/user/routines/${routineId}/`}>
              <ArrowLeftIcon className="w-8 h-8 text-green-500 cursor-pointer hover:text-green-700" />
            </Link>
          </div>
          <Heading size="6" className="text-radixgreen mt-8 mb-3 mx-auto">Entrenamientos para la Rutina {nombre}</Heading>
          <div></div> {/* Sin este div el texto se mueve a la derecha */}
        </div>
          {apiDataLoaded && workouts.length > 0 ? (
            workouts.map((workout) => (
              <div key={workout.id}>
              <button
                className="w-full my-4 p-4 rounded-lg flex items-center gap-3 bg-green-100 cursor-pointer focus:outline-none"
                onClick={() => toggleFormVisibility(workout.id)}
              >
                <div>
                  <p className="font-bold mb-1">
                    <span className="text-black">{workout.name}</span>
                  </p>
                </div>
                <div className="flex items-center justify-end flex-grow">
                  <p className="font-bold mb-1 text-black mr-2">
                    {equipoNames[workout.id] || 'Sin máquinas asignadas'}
                  </p>
                  <ChevronDownIcon className="w-6 h-6" />
                </div>
              </button>
              <Flex direction="column" gap="3" className="mt-4">
                {hideForms[workout.id] && (
                  <div className="w-full">
                    <FormContainer>
                      <SerieForm workoutID={workout.id}/>
                    </FormContainer>
                  </div>
                )}
              </Flex>
            </div>
        ))) : (<p className="text-red-500">No hay entrenamientos disponibles.</p>) }
      </div>
    </>
  );
};



export default EditWorkout;