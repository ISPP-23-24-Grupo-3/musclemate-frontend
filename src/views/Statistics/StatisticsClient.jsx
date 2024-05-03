import React, { useEffect, useState } from 'react';
import { getFromApi } from '../../utils/functions/api';
import { Heading } from "@radix-ui/themes";

const ShowStatistics = () => {
    const [workouts, setWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [series, setSeries] = useState([]);

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
            serie.sort((a, b) => new Date(b.date) - new Date(a.date));
            setSeries(serie)
        };
        fetchSeries();
    },[workouts]);

    return (
        <>
            <div className='text-radixgreen mb-5 mx-auto text-center'>
                <Heading size="8">Historial de tus ejercicios</Heading>
            </div>
            <div className="mx-auto mt-1 m-5">
                <ul className='mt-1'>
                    {series.length > 0 ? (
                    series.map((serie) => (
                        <li key={serie.id} className={`bg-white p-4 rounded-md mb-4`} style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px -2px 2px rgba(0, 0, 0, 0.1)" }}>
                                    <div className="grid md:grid-cols-4 md:grid-rows-1 md:gap-0 gap-3 grid-cols-2 grid-rows-2">
                                        <div className={`flex-col justify-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}>
                                            <p>Fecha de creación:</p>
                                            <span className="text-black md:text-lg text-sm">{serie.date}</span>
                                        </div>
                                        <div className={`flex-col justify-center items-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}>
                                            <p>Repeticiones:</p>
                                            <span className="text-black md:text-lg text-sm">{serie.reps}</span>
                                        </div>
                                        <div className={`flex-col justify-center items-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}>
                                            <p>Peso:</p>
                                            <span className="text-black md:text-lg text-sm">{serie.weight}</span>
                                        </div>
                                        <div className={`flex-col justify-center items-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}>
                                            <p>Entrenamiento:</p>
                                            <span className="text-black md:text-lg text-sm">{serie.equipment}</span>
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