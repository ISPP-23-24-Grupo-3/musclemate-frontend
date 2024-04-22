import React, { useEffect, useState } from 'react';
import { getFromApi } from '../../utils/functions/api';
import { EquipmentSelect } from "../../components/Equipments";
import {Button,Text,Heading} from "@radix-ui/themes";
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

const ShowStatistics = () => {
    const [tipo, setTipo] = useState('peso');
    const [equipment, setEquipment] = useState({});
    const [chartData, setChartData] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [series, setSeries] = useState([]);

    function formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
      
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
      
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await getFromApi(`routines/`);
                if (response.ok) {
                    let data = await response.json();
                    setRoutines(data)
                } else {
                    console.error('Error fetching API workouts:', response.status);
                }
                } catch (error) {
                console.error('Error fetching API workouts:', error);
            }
        };
        fetchRoutines();
    },[]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            let workouts=[];
            for (let routine of routines){
                try {
                const response = await getFromApi(`workouts/byRoutine/${routine.id}/`);
                if (response.ok) {
                    let data = await response.json();
                    
                    workouts.push(...data)
                } else {
                    console.error('Error fetching API workouts:', response.status);
                }
                } catch (error) {
                console.error('Error fetching API workouts:', error);
                }
            }
            setWorkouts(workouts);
        };
        fetchWorkouts();
    },[routines]);

    const equipmentName = async (equipmentsId)=> {
        let equipName=[]
        if(equipmentsId.length>0){
            for (let i = 0; i < equipmentsId.length; i++) {
                const response = await getFromApi("equipments/detail/"+ equipmentsId[i] +"/");
                if(response.ok){
                    let data = await response.json();
                    if(i<equipmentsId.length-1){
                        equipName.push(data.name+", ");
                    }
                    else{
                        equipName.push(data.name);
                    }
                }
            }
        }
        else{
             let equipName= "Sin máquinas asignadas";
             return equipName
        }
        return equipName;
      };

    useEffect(() => {
        const fetchSeries = async () => {
            let chartData = [];
            let serie=[];
            for (let workout of workouts){
                try {
                let workoutId=workout.id
                const name = await equipmentName(workout.equipment);
                const response = await getFromApi(`series/workout/${workoutId}/`);
                if (response.ok) {
                    let data = await response.json();
                    let dataWithEquipment = data.map(serie => ({
                        id:serie.id,
                        reps:serie.reps,
                        weight: serie.weight,
                        date: serie.date,
                        equipment: name,
                        duration:serie.duration,
                        }));
                    serie.push(...dataWithEquipment)
                    data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    let workoutChartData = data.map(serie => ({
                    reps:serie.reps,
                    weight: serie.weight,
                    date: serie.date,
                    }));
                    if (workout.equipment.includes(Number(equipment))) {
                        chartData.push(...workoutChartData);
                    }
                }
                }catch (error) {
                console.error('Error fetching API workout:', error);
                }
            }
            chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
            setChartData(chartData);
            serie.sort((a, b) => new Date(b.date) - new Date(a.date));
            setSeries(serie)
        };
        fetchSeries();
    },[workouts,equipment]);

    return (
        <>
            <div className='text-radixgreen mt-8 mb-4 mx-auto text-center'>
                <Heading size="8">Gráficas de tu evolución</Heading>
            </div>
            <div className="flex items-center justify-center">
                <div className="mr-4">
                    <EquipmentSelect
                        onChange={(e) => { setEquipment(e.target.value) }}
                    />
                </div>
                <div className="mt-5">
                    {tipo === 'peso' ? (
                        <Button onClick={() => setTipo('reps')} className="w-full" size="4">
                            <Text>Mostrar Repeticiones</Text>
                        </Button>
                    ) : (
                        <Button onClick={() => setTipo('peso')} className="w-full" size="4">
                            <Text>Mostrar Pesos</Text>
                        </Button>
                    )}
                </div>
            </div>
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
            <div className='text-radixgreen mt-10 mb-5 mx-auto text-center'>
                <Heading size="8">Historial de tus ejercicios</Heading>
            </div>
            <div className="mx-auto mt-1 m-5">
                <ul className='mt-1'>
                    {series.length > 0 ? (
                    series.map((serie) => (
                        <li key={serie.id} className={`bg-white p-4 rounded-md mb-4`} style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px -2px 2px rgba(0, 0, 0, 0.1)" }}>
                            <div className="flex items-center mb-2">
                                <div className='flex justify-around w-full md:text-center'>
                                    <div className="mr-4 flex items-center">
                                        <div className={`text-radixgreen font-bold mb-1 text-xl`}>
                                            <p>Fecha de creación:</p>
                                            <span className="text-black">{serie.date}</span>
                                        </div>
                                        <div className={`ml-12 text-radixgreen font-bold mb-1 text-xl`}>
                                            <p>Repeticiones:</p>
                                            <span className="text-black">{serie.reps}</span>
                                        </div>
                                        <div className={`ml-12 text-radixgreen font-bold mb-1 text-xl`}>
                                            <p>Peso:</p>
                                            <span className="text-black">{serie.weight}</span>
                                        </div>
                                        <div className={`ml-12 text-radixgreen font-bold mb-1 text-xl`}>
                                            <p>Entrenamiento:</p>
                                            <span className="text-black">{serie.equipment}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                    ))
                    ) : (
                        <p className="text-red-500">El historial está vacío porque aún no ha creado ninguna serie</p>
                    )}
                </ul>
            </div>
        </>
        );
};

export default ShowStatistics;