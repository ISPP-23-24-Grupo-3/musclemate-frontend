import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteFromApi, getFromApi, postToApi, putToApi } from '../../utils/functions/api';

import { Button, TextField, Text, IconButton, Card, ScrollArea } from "@radix-ui/themes";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useForm } from 'react-hook-form';

import { LuPencil } from "react-icons/lu";
import { CgTrash } from "react-icons/cg";

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


const Series = () => {
  const { workoutId } = useParams();
  const [series, setSeries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [timerOn, setTimerOn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [editor, setEditor] = useState(
    series.reduce((acc, serie) => ({ ...acc, [serie.id]: false }), {})
  );

  function formatDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
  
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await getFromApi(`series/workout/${workoutId}/`);
        if (response.ok) {
          let data = await response.json();
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
          const chartData = data.map(serie => ({
            weight: serie.weight,
            date: serie.date,
          }));
          setChartData(chartData.reverse());
          setSeries(data);
          setEditor(data.reduce((acc, serie) => ({ ...acc, [serie.id]: false }), {}));
          setApiDataLoaded(true);
        } else {
          console.error('Error fetching API series:', response.status);
        }
      } catch (error) {
        console.error('Error fetching API series:', error);
      }
    };

    fetchSeries();
  }, [workoutId]);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await getFromApi(`workouts/detail/${workoutId}/`);
        if (response.ok) {
          const data = await response.json();
          setNombre(data.name);
        } else {
          console.error('Error fetching API workout:', response.status);
        }
      } catch (error) {
        console.error('Error fetching API workout:', error);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    if(!timerOn) {
      postToApi("series/create/", {
        reps: data.reps,
        weight: data.peso,
        date: new Date().toISOString().split('T')[0],
        workout: workoutId,
        duration: timer
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Error al crear la serie:", response.status);
        }
      })
      .then((data) => {
        setSeries([...series, data]);
        reset({ reps: '', peso: '' });
      });
      setOpen(false);
      setTimer(0);
    } else {
      alert('Debes parar la serie antes de aceptar');
    }
  };

  useEffect(() => {
    let interval = null;
  
    if (timerOn) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [timerOn]);

  const editSerie = (id, reps, weight) => {
    let serie = series.find((serie) => serie.id === id);
    console.log(serie, reps, weight);
    putToApi(`series/update/${id}/`, {
      reps: reps === "" ? serie.reps : reps,
      weight: weight === "" ? serie.weight : weight,
      date: serie.date,
      workout: workoutId,
      duration: serie.duration
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error("Error al actualizar la serie:", response.status);
      }
    })
    .then((data) => {
      setSeries(series.map((serie) => (serie.id === id ? data : serie)));
    });

  };

  const deleteSerie = (id) => {
    deleteFromApi(`series/delete/${id}/`)
    .then((response) => {
      if (response.ok) {
        setSeries(series.filter((serie) => serie.id !== id));
      } else {
        console.error("Error al eliminar la serie:", response.status);
      }
    });
  }

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await getFromApi(`series/workout/${workoutId}/`);
        if (response.ok) {
          let data = await response.json();
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
          const chartData = data.map(serie => ({
            weight: serie.weight,
            date: serie.date,
          }));
          setChartData(chartData.reverse());
        } else {
          console.error('Error fetching API series:', response.status);
        }
      } catch (error) {
        console.error('Error fetching API series:', error);
      }
    };

    fetchGraph();
  }, [series]);

  return (
    <div className="max-w-lg mx-auto mt-8 m-5">
      <h2 className="text-radixgreen mt-8 mb-3 md:text-center">Series del Entrenamiento {nombre.toUpperCase()}</h2>
      
      <Button onClick={() => setOpen(!open)} className='w-full mb-1' size="4">
        <Text>Crear Serie</Text>
        <IoMdAddCircleOutline />
      </Button>

      {open && (
        <Card className='mt-5 mb-8 shadow-lg border-2 border-radixgreen'>
          <div className='flex items-center justify-around text-radixgreen/80 font-bold'>
            <div>
              <Text>Repeticiones: </Text>
              <TextField.Input {...register("reps", {
                validate: value => (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser un número entero positivo",
              })}></TextField.Input>
              <span className="text-red-500">{errors.reps?.message}</span>
              <Text>Peso: </Text>
              <TextField.Input {...register("peso", {
                validate: value => (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser un número entero positivo",
              })} ></TextField.Input>
              <span className="text-red-500">{errors.peso?.message}</span>
            </div>
            <div className='flex flex-col space-y-2'>
              <Text>Duración: {formatDuration(timer)}</Text>
              <Button onClick={() => setTimerOn(!timerOn)} className='mt-5' size="2">{timerOn ? 'Parar' : timer>0 ? "Reanudar" : 'Empezar'}</Button>
            </div>
          </div>
          <div className='flex justify-center mt-3'>
            <Button onClick={handleSubmit((data) => {
              onSubmit(data);
            })} className='mt-5' size="3">Enviar</Button>
          </div>
        </Card>
      )}
      
      <ScrollArea orientation="horizontal" style={{ marginTop: 30, whiteSpace: 'nowrap' }}>
        {apiDataLoaded && series.length > 0 ? (
          series.map((serie) => (
            <Card key={serie.id} style={{ display: 'inline-flex', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 2, height: 5 }, shadowOpacity: 2, shadowRadius: 5, elevation: 5, padding: 4, borderWidth: 5, borderRadius: 4, marginRight: 5, }}>
              <div className="flex items-center mb-2">
                <div className='flex justify-around w-full md:text-center '>
                  <div className="mr-4 mt-2">
                    <p className={`${editor[serie.id] ? "hidden" : undefined} text-radixgreen font-bold mb-1`}>
                      Repeticiones: <span className="text-black">{serie.reps}</span>
                    </p>
                    <p className={`${editor[serie.id] ? "hidden" : undefined} text-radixgreen font-bold mb-1`}>
                      Peso: <span className="text-black">{serie.weight}</span>
                    </p>

                    <form className={`${editor[serie.id] ? undefined : "hidden"} text-radixgreen font-bold`}
                    onSubmit={handleSubmit((r) => {
                      editSerie(serie.id, r[`reps${serie.id}`], r[`peso${serie.id}`]);
                      setEditor(prev => ({ ...prev, [serie.id]: false }));
                    })}>
                      Repeticiones:
                      <TextField.Input
                          color={`${errors[`reps${serie.id}`] ? "red" : "green"}`}
                          defaultValue={serie.reps}
                        {...register(`reps${serie.id}`, {
                          validate: value => value === "" || (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser un número entero positivo",
                        })}
                      ></TextField.Input>
                      <span className="text-red-500">{errors[`reps${serie.id}`] && errors[`reps${serie.id}`].message}</span>  
                      Peso:
                      <TextField.Input
                          color={`${errors[`peso${serie.id}`] ? "red" : "green"}`}
                          defaultValue={serie.weight}
                          {...register(`peso${serie.id}`, {
                            validate: value => value === "" || (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser un número entero positivo",
                        })}
                      ></TextField.Input>
                      <span className="text-red-500">{errors[`peso${serie.id}`] && errors[`peso${serie.id}`].message}</span>                      
                      <Button>Aceptar</Button>
                    </form>

                  </div>
                  <div className='mt-2 mr-2'>
                    <p className="text-radixgreen font-bold mb-1">
                      Fecha: <span className="text-black">{serie.date}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Duracion: <span className="text-black">{formatDuration(serie.duration)}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 8 }}>
                    <IconButton size="2" radius="full" onClick={() => setEditor(prev => ({ ...prev, [serie.id]: !prev[serie.id] }))}>
                      <LuPencil />
                    </IconButton>
                    <IconButton size="2" radius="full" color="red" onClick={() => deleteSerie(serie.id)}>
                      <CgTrash />
                    </IconButton>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-red-500">No hay series disponibles para este entrenamiento.</p>
        )}
      </ScrollArea>
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
                label: 'Mis Pesos',
                data: chartData.map((serie) => serie.weight),
                fill: true,
                borderColor: 'rgb(48, 164, 108)', 
                backgroundColor: 'rgba(48, 164, 108, 0.4)',
              },
            ],
          }} 
        />;
      </div>
    </div>
  );
};

export default Series;
