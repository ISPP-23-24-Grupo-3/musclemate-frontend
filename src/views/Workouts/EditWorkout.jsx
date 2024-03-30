import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromApi } from '../../utils/functions/api';
import { useLocation } from 'react-router';

const EditWorkout = () => {
  const location = useLocation();
  const routineId = location.state.routineId;
  const [nombre, setNombre] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [equipoNames, setEquipoNames] = useState({});
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const navigate = useNavigate(); 

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

  const handleViewSeries = (workoutId) => {
    navigate(`/user/workout/${workoutId}/series`); 
  };

  useEffect(() => {
    const fetchEquipoNames = async () => {
      const newEquipoNames = {};
      for (const workout of workouts) {
        const names = await equipo(workout.equipment);
        newEquipoNames[workout.id] = names;
      }
      setEquipoNames(newEquipoNames);
    };
  
    fetchEquipoNames();
  }, [workouts]);

  const equipo = async (equipo) => {
    let equipoName = [];
    if (equipo) {
      for (let i = 0; i < equipo.length; i++) {
        const response = await getFromApi("equipments/detail/"+ Number(equipo[i]) +"/");
        const data = await response.json();
        equipoName.push(data.name);
      }
    }
    return equipoName;
  };

  return (
    <div className="max-w-lg mx-auto mt-8 m-5">
      <h2 className="text-radixgreen mt-8 mb-3 md:text-center">Entrenamientos para la Rutina {nombre}</h2>
      <ul>
        {apiDataLoaded && workouts.length > 0 ? (
          workouts.map((workout) => (
            <li key={workout.id} className="bg-white shadow-md p-4 rounded-md mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="mr-4">
                    <p className="text-radixgreen font-bold mb-1">
                      Nombre del Entrenamiento: <span className="text-black">{workout.name}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-radixgreen font-bold mb-1">
                      Máquina: <span className="text-black">{ equipoNames[workout.equipment] || 'Sin asignar'}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <button onClick={() => handleViewSeries(workout.id)} className="text-blue-600 font-bold">Ver detalles</button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-red-500">No hay entrenamientos disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default EditWorkout;
