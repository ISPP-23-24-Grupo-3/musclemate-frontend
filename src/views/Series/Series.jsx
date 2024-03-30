import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFromApi, postToApi } from '../../utils/functions/api';

import { Button, TextField, Text, Section } from "@radix-ui/themes";
import { IoMdAddCircleOutline } from "react-icons/io";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useForm } from 'react-hook-form';

const Series = () => {
  const { workoutId } = useParams();
  const [series, setSeries] = useState([]);
  const [nombre, setNombre] = useState('');
  const [timerOn, setTimerOn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [entrada, setEntrada] = useState([]);

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
          data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena las series por fecha
          setSeries(data);
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
    });

    reset();
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

  const alerta = () => {
    if(timerOn) {
      alert('Debes parar la serie antes de aceptar');
    } 
  }

  return (
    <div className="max-w-lg mx-auto mt-8 m-5">
      <h2 className="text-radixgreen mt-8 mb-3 md:text-center">Series del Entrenamiento {nombre.toUpperCase()}</h2>
      
      <Collapsible.Root>
        <Collapsible.Trigger className="w-full">
          <span
            className="w-full flex items-center justify-center bg-radixgreen rounded-lg p-3 mb-5 hover:bg-radixgreen/50 text-white text-lg"
            type="submit">
            <IoMdAddCircleOutline className="size-6 mr-2" />
            Añadir Serie
          </span>
        </Collapsible.Trigger>
        <Collapsible.Content>
            <form
            onSubmit={handleSubmit(onSubmit)}
            className={`rounded-lg mb-4 p-5 px-3 flex justify-between border border-radixgreen/30`}
          >
            <div className="flex-row">
              <div className="flex gap-3 items-center text-radixgreen">
                Repeticiones:
                <TextField.Input
                  color={`${errors.name ? "red" : "green"}`}
                  {...register("reps", {
                    required: "Debes escribir un numero positivo",
                    validate: value => value > 0 || "El valor debe ser un número positivo"
                  })}
                ></TextField.Input>
                <span className="text-red-500">{errors.reps?.message}</span>

                Peso:
                <TextField.Input
                  color={`${errors.name ? "red" : "green"}`}
                  {...register("peso", {
                    required: "Debes escribir un numero positivo",
                    validate: value => value > 0 || "El valor debe ser un número positivo"
                  })}
                ></TextField.Input>
                <span className="text-red-500">{errors.peso?.message}</span>
              </div>
              <div className="flex gap-3 items-center text-radixgreen mt-3 justify-center font-bold">
                <Text>{formatDuration(timer)}</Text>
              </div>
              <div className="flex gap-3 items-center text-radixgreen mt-1 justify-center">
                <Button type='button' onClick={() => setTimerOn(!timerOn)}>
                  {timerOn ? 'Parar Serie' : timer>0 ? 'Reanudar Serie' : 'Iniciar Serie'}
                </Button>
              </div>
           
            </div>
            <Button onClick={alerta}>Aceptar</Button>
          </form>
        </Collapsible.Content>
      </Collapsible.Root>
      
      <ul>
        {apiDataLoaded && series.length > 0 ? (
          series.map((serie) => (
            <li key={serie.id} className="bg-white shadow-md p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <div className='flex justify-around w-full md:text-center'>
                  <div className="mr-4">
                    <p className="text-radixgreen font-bold mb-1">
                      Repeticiones: <span className="text-black">{serie.reps}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Peso: <span className="text-black">{serie.weight}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-radixgreen font-bold mb-1">
                      Fecha: <span className="text-black">{serie.date}</span>
                    </p>
                    <p className="text-radixgreen font-bold mb-1">
                      Duracion: <span className="text-black">{formatDuration(serie.duration)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-red-500">No hay series disponibles para este entrenamiento.</p>
        )}
      </ul>
    </div>
  );
};

export default Series;
