import React, { useEffect, useState } from 'react';
import { getFromApi } from '../../utils/functions/api';
import {Heading,Flex, Button,Text} from "@radix-ui/themes";
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { FormContainer } from "../../components/Form";
import { Series as SerieForm } from "../../components/Series/Series";
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { EquipmentSelect } from "../../components/Equipments";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const EditWorkout = () => {
  const [tipo, setTipo] = useState('peso');
  const [equipment, setEquipment] = useState({});
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
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
    const fetchSeries = async () => {
      if (showChart) {
        let chartData = [];
        for (let workout of workouts){
          if (workout.equipment.includes(Number(equipment))) {
            try {
              let workoutId=workout.id
              const response = await getFromApi(`series/workout/${workoutId}/`);
              if (response.ok) {
                let data = await response.json();
                data.sort((a, b) => new Date(a.date) - new Date(b.date));
                const workoutChartData = data.map(serie => ({
                  reps:serie.reps,
                  weight: serie.weight,
                  date: serie.date,
                }));
                chartData.push(...workoutChartData);
              }
            }catch (error) {
              console.error('Error fetching API workout:', error);
            }
          }
        }
        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setChartData(chartData);
      }
      else{
        setEquipment(0)
      }
    };

    fetchSeries();
  }, [showChart,workouts,equipment]);


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
        <div className="flex justify-center space-x-4 mt-5 mr-4">
          <span>
          Solo se muestran las series con fecha de hoy <strong>{new Date().toISOString().split('T')[0]}</strong>, para ver tu historial y tu evolución accede a 
            <Link to={`/user/statistics`} className="w-8 h-8 text-green-500 hover:text-green-700">
              &nbsp;<strong>estadísticas</strong>
            </Link>
          </span>
        </div>
        {showChart==true ? 
        <div>
          <EquipmentSelect
            onChange={(e) =>{ setEquipment(e.target.value)}}
          />
          <div className='mt-7'>
          <Line 
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} 
            data={{
              labels: chartData.map((serie) => serie.date),
              datasets: [
                {
                  label: `Mis ${tipo == 'peso' ? 'pesos' : 'repeticiones'}`,
                  data: chartData.map((serie) => tipo == 'peso' ? serie.weight : serie.reps),
                  fill: true,
                  borderColor: 'rgb(48, 164, 108)', 
                  backgroundColor: 'rgba(48, 164, 108, 0.4)',
                },
              ],
            }} 
          />
          </div>
          <div className="mt-5 mr-4 flex justify-center" >
            {tipo == 'peso' ?
              <Button onClick={() => setTipo('reps')} className='w-1/2' size="4">
                <Text>Mostrar Repeticiones</Text>
              </Button>
            :  
              <Button onClick={() => setTipo('peso')} className='w-1/2' size="4">
                <Text>Mostrar Pesos</Text>
              </Button>
            }
          </div>
        </div>
      : undefined
      }
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