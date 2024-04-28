import { Button, Container, Text, Heading, Link } from "@radix-ui/themes";
import { React, useContext, useEffect, useState } from "react";
import { RoutineList } from "../../components/Routines/RoutineList";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi } from "../../utils/functions/api";
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

export default function ClientHomePage() {

  const { user } = useContext(AuthContext);
  const [gymPlan, setGymPlan] = useState("");
  const [tipo, setTipo] = useState('peso');
  const [equipment, setEquipment] = useState({});
  const [workouts, setWorkouts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [routines, setRoutines] = useState([]);

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
    ChartJS.defaults.font.size = 13;
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
    };
    fetchSeries();
  },[workouts,equipment]);

  useEffect(() => {
    if (user) {
        getFromApi("clients/detail/" + user.username + "/") 
            .then((response) => response.json())
            .then((data) => {
              let gym = data.gym;
              getFromApi("gyms/detail/" + gym + "/") 
              .then((response) => response.json())
              .then((data) => {
                setGymPlan(data.subscription_plan);
              });
            });
    }
  }, [user]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div style={{flex: '1'}}>
          <Heading as="h1" className="!mb-3">
            <Link href="./routines">Mis Rutinas</Link>
          </Heading>
          {gymPlan !== "free" ? (
            <RoutineList />
          ) : (
            <div className="text-red-700">La subscripción de tu gimnasio no incluye esta funcionalidad.</div>
          )}
        </div>
        <div style={{flex: '1'}}>
          <Heading as="h1">
            <Link href="./events">Mis Eventos</Link>
          </Heading>
          {/*TODO: Add booked events here*/}
        </div>
        <div style={{flex: '1'}}>
          <Heading as="h1">
            <Link href="./statistics">Mi Historial</Link>
          </Heading>
          <div className="flex items-center justify-center">
            <div className="mr-4 mt-2">
                <EquipmentSelect onChange={(e) => { setEquipment(e.target.value) }}/>
            </div>
            <div className="mt-2">
              {tipo === 'peso' ? (
                  <Button onClick={() => setTipo('reps')} className="w-full" size="4">
                      <Text>Mostrar Repes</Text>
                  </Button>
              ) : (
                  <Button onClick={() => setTipo('peso')} className="w-full" size="4">
                      <Text>Mostrar Pesos</Text>
                  </Button>
              )}
            </div>
          </div>
          <div className='mt-7'>
            {chartData.length > 0 ? (
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
              />) 
            : 
              (<div style={{color: 'red', fontSize: '18px', textAlign: 'center'}}>No hay datos para mostrar</div>)
            }
          </div>
        </div>
      </div>
    </>
  );
}
