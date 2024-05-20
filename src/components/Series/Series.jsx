import React, { useEffect, useState } from 'react';
import { deleteFromApi, getFromApi, postToApi, putToApi } from '../../utils/functions/api';
import { Button, TextField, Text, IconButton, Card } from "@radix-ui/themes";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { LuPencil } from "react-icons/lu";
import { CgTrash } from "react-icons/cg";

export const Series = (workoutID) => {
  const [duration, setDuration] = useState(0);
  const workoutId = workoutID.workoutID
  const [series, setSeries] = useState([]);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [timerOn, setTimerOn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);
  const [editor, setEditor] = useState(
    series.reduce((acc, serie) => ({ ...acc, [serie.id]: false }), {})
  );
  const [showStartButton, setShowStartButton] = useState({});
  const [serieTimerOn, setSerieTimerOn] = useState({});
  const [editingSerieId, setEditingSerieId] = useState(null);

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
          const currentDate = new Date().toISOString().split('T')[0];
          const filteredData = data.filter(serie => serie.date == currentDate);
          setSeries(filteredData);
          setEditor(filteredData.reduce((acc, serie) => ({ ...acc, [serie.id]: false }), {}));
          setApiDataLoaded(true);
        }
      }catch (error) {
        console.error('Error fetching API workout:', error);
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
        }
      } catch (error) {
        console.error('Error fetching API workout:', error);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  const { register, handleSubmit, reset,watch,setValue, formState: { errors } } = useForm({});

  const onSubmit = (data) => {
    if(data.reps==""){
      data.reps=0
    }
    if(data.peso==""){
      data.peso=0
    }
    if(data.duration==""){
      data.duration=0
    }

    if (data.reps>9999){
      alert('Las repeticiones no pueden ser mayores de 9999');
    }
    else if (data.peso>9999){
      alert('El peso no puede ser mayor de 9999');
    }
    else if (data.duration>9999){
      alert('El peso no puede ser mayor de 9999');
    }
    else{
      postToApi("series/create/", {
        reps: data.reps,
        weight: data.peso,
        date: new Date().toISOString().split('T')[0],
        workout: workoutId,
        duration: data.duration
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }else {
          console.error("Error al crear la serie:", response.status);
        }
      })
      .then((data) => {
        setSeries([...series, data]);
        reset({ reps: '', peso: '' });
      });
      setOpen(false);
      setTimer(0);
    }
  };

  const startSerieTimer = (id) => {
    // Detener todos los temporizadores activos
    Object.keys(serieTimerOn).forEach(key => {
      if (serieTimerOn[key]) {
        stopSerieTimer(parseInt(key));
      }
    });
  
    // Iniciar el temporizador para la serie seleccionada
    setSerieTimerOn((prev) => ({ ...prev, [id]: true }));
    setShowStartButton((prev) => ({ ...prev, [id]: false }));
  };

  const stopSerieTimer = (id) => {
    setSerieTimerOn((prev) => ({ ...prev, [id]: false }));
    setShowStartButton((prev) => ({ ...prev, [id]: true }));
    // Enviar una solicitud a la API para actualizar la duración
    let serie = series.find((serie) => serie.id === id);
    setDuration(serie.duration)
      putToApi(`series/update/${id}/`, {
        reps: serie.reps,
        weight: serie.weight,
        date: new Date().toISOString().split('T')[0],
        workout: workoutId,
        duration: serie.duration
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Error al actualizar la duración:", response.status);
        }
      })
      .then((data) => {
        setSeries(series.map((serie) => (serie.id == id ? data : serie)));
      });

      setTimer(0);
  };

  useEffect(() => {
    let interval = null;
    
    if (timerOn) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
      setTimer(0)
    }
  
    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    let interval = null;
    let timerOff=false;
    let idSerie = null;
    series.forEach((serie) => {
      if (serieTimerOn[serie.id]) {
        idSerie=serie.id
        if (serie.duration>0){
          interval = setInterval(() => {
            setSeries((prevSeries) =>
              prevSeries.map((prevSerie) =>
                prevSerie.id === serie.id
                  ? prevSerie.duration>0 ? {
                      ...prevSerie,
                      duration: prevSerie.duration - 1,} : timerOff=true
                  : prevSerie
              )
            );
          }, 1000);}
        else { 
          timerOff=true
        }
      }
    });

    if (timerOff){
      stopSerieTimer(idSerie)
    }

    return () => clearInterval(interval);
  }, [serieTimerOn, series]);


  const editSerie = (id, reps, weight) => {
    let serie = series.find((serie) => serie.id === id);
    let durationn = watch(`durationn${serie.id}`);
    if(reps==""){
      reps=0
    }
    if(weight==""){
      peso=0
    }
    if(durationn==""){
      durationn=0
    }

    if (reps>99999){
      alert('Las repeticiones no pueden ser mayores de 99999');
    }
    else if (weight>99999){
      alert('El peso no puede ser mayor de 99999');
    }
    else{
      putToApi(`series/update/${id}/`, {
        reps: reps === "" ? serie.reps : reps,
        weight: weight === "" ? serie.weight : weight,
        date: new Date().toISOString().split('T')[0],
        workout: workoutId,
        duration: durationn === 0 ? serie.duration : durationn
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
    }
  };

  const deleteSerie = (serie) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas borrar la serie?`,
      )
    ) {
      deleteFromApi(`series/delete/${serie.id}/`)
      .then((response) => {
        if (response.ok) {
          setSeries(series.filter((s) => s.id !== serie.id));
        } else {
          console.error("Error al eliminar la serie:", response.status);
        }
      });
    }
  }

  useEffect(() => {
    const initialShowStartButtonState = series.reduce((acc, serie) => {
      acc[serie.id] = true;
      return acc;
    }, {});
    setShowStartButton(initialShowStartButtonState);
  }, []);

  useEffect(() => {
    const editedSerie = series.find(serie => serie.id === editingSerieId);
    if (editedSerie) {
      setDuration(editedSerie.duration);
    }
  }, [editingSerieId, series]);

  const startEditing = (id) => {
    Object.keys(serieTimerOn).forEach(key => {
      if (serieTimerOn[key]) {
        stopSerieTimer(parseInt(key));
      }
    });
    setEditingSerieId(id);
    let editedSerie = series.find((serie) => serie.id === id);
    setDuration(editedSerie.duration);
    duration ==0 ? null :setValue(`durationn${id}`, duration);
  };

  return (
    <>
    <div className="mx-auto mt-1 m-5">
      <ul className='mt-1'>

      <li className="flex items-center justify-center mb-5">
        <div className="flex items-center">
          <div>
            <p className="text-radixgreen font-bold mb-1"></p>
            <p className="text-radixgreen font-bold mb-1 text-xl">
              Cronómetro de descansos: <span className="text-black">{formatDuration(timer)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center ml-5">
          <Button onClick={() => timerOn ? setTimerOn(false) : setTimerOn(true)} className='mt-5' size="3">
            {timerOn ? "Detener" : "Empezar"}
          </Button>
        </div>
      </li>
        <ScrollArea.Root className="w-full h-[420px] rounded overflow-hidden shadow-[0_2px_10px] shadow-blackA4 bg-white">
          <ScrollArea.Viewport className="w-full h-full rounded">
            {apiDataLoaded && series.length > 0 ? (
              series.map((serie) => (
                <li 
                  key={serie.id} className={`bg-white p-4 rounded-md mb-4 ${editor[serie.id] ? "editing" : ""}`}
                  style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px -2px 2px rgba(0, 0, 0, 0.1)" }}>
                    <div className='md:flex justify-around w-full text-center grid grid-cols-1 gap-4 '>
                      <div className='flex md:flex-col flex-row md:items-center justify-center gap-3'>
                        <div className="">
                          <IconButton size="2" radius="full" onClick={() =>{setEditor(prev => ({ ...prev, [serie.id]: !prev[serie.id] })); startEditing(serie.id)}}>
                            <LuPencil />
                          </IconButton>
                        </div>
                        <div className="">
                          <IconButton size="2" radius="full" color="red" onClick={() => deleteSerie(serie)}>
                            <CgTrash />
                          </IconButton>
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-5">
                        
                        <div className={`${editor[serie.id] ? "hidden" : undefined} text-radixgreen font-bold text-xl`}>
                          <p>Repeticiones: <span className="text-black">{serie.reps}</span></p>
                        </div>
                        <div className={` ${editor[serie.id] ? "hidden" : undefined} text-radixgreen font-bold text-xl`}>
                          <p>Peso: <span className="text-black">{serie.weight}Kg</span></p>
                        </div>
                      </div>
                      <div className={`${editor[serie.id] ? undefined : "absolute"}`}>
                        <form className={`${editor[serie.id] ? undefined : "hidden"} text-radixgreen font-bold`}
                        onSubmit={handleSubmit((r) => {
                          editSerie(serie.id, r[`reps${serie.id}`], r[`peso${serie.id}`]);
                          setEditor(prev => ({ ...prev, [serie.id]: false }));
                          })}>
                          <div className="flex flex-col items-center">
                            <div className="flex flex-wrap justify-center">
                              <div className="mr-4 mb-2 text-xl">
                                <p>Repeticiones:</p>
                                <div className="w-32">
                                  <TextField.Input
                                    color={`${errors[`reps${serie.id}`] ? "red" : "green"}`}
                                    defaultValue={serie.reps}
                                    {...register(`reps${serie.id}`, {
                                      validate: value => value === "" || (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser mayor que 0",
                                    })}
                                  />
                                  </div>   
                              </div>
                              <div className="mr-4 mb-2 text-xl">
                                <p>Peso:</p>
                                <div className="w-32">
                                  <TextField.Input
                                    className="w-30"
                                    color={`${errors[`peso${serie.id}`] ? "red" : "green"}`}
                                    placeholder='En Kg'
                                    defaultValue={serie.weight}
                                    {...register(`peso${serie.id}`, {
                                      validate: value => value === "" || (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser mayor que 0",
                                    })}
                                  />
                                </div>
                              </div>
                              <div className="mr-4 mb-2 text-xl">
                                <p>Duración:</p>
                                <div className="w-32">
                                  <TextField.Input
                                    color={`${errors[`durationn${serie.id}`] ? "red" : "green"}`}
                                    defaultValue={duration === 0 ? serie.duration : duration}
                                    placeholder='En segundos'
                                    onChange={(e) =>{ setDuration(e.target.value)}}
                                    {...register(`durationn${serie.id}`, {
                                      validate: value => value === "" || (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser mayor que 0",
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            <span className={`${errors[`reps${serie.id}`] || errors[`peso${serie.id}`]
                            || errors[`durationn${serie.id}`] ? "text-red-500" : "hidden"} block mb-2`}>
                              Todos los campos deben ser mayores que 0
                            </span>
                            <Button>Aceptar</Button>
                          </div>
                        </form>
                      </div>
                      <div className="grid grid-cols-1 md:flex md:items-center">
                        <div>
                          <p className="text-radixgreen font-bold mb-1">
                          </p>
                          <p className={`text-radixgreen font-bold mb-1 text-xl ${editor[serie.id] ? "hidden" : undefined}`}>
                            Duración: <span className="text-black">{formatDuration(serie.duration)}</span>
                          </p>
                        </div>
                      </div>
                        {open ? null : (
                          <div className={`flex flex-col space-y-2 justify-center ${editor[serie.id] ? "hidden" : undefined}`}>
                          <Button onClick={() => serieTimerOn[serie.id] ? stopSerieTimer(serie.id) : startSerieTimer(serie.id)} className='mt-5' size="3">
                            {serieTimerOn[serie.id] ? "Parar" : "Empezar"}
                          </Button>
                          </div>
                        )}
                    </div>
                </li>
              ))
              ) : (
                <p className="text-red-500">No hay series disponibles para este entrenamiento.</p>
              )}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="vertical"
              >
                <ScrollArea.Thumb style={{
                  position: 'relative',
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '8px'}} 
                />
              </ScrollArea.Scrollbar>
              <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="horizontal"
              >
                <ScrollArea.Thumb 
                  style={{
                    position: 'relative',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '8px'
                  }}
                />
              </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="bg-blackA5" />
          </ScrollArea.Root>
        </ul>
      
      <div className="flex justify-center space-x-4 mt-5 mr-4">
        <Button onClick={() => setOpen(!open)} className='w-1/2' size="4">
          <Text>Crear Serie</Text>
          <IoMdAddCircleOutline />
        </Button>
      </div>
      {open && (
        <Card className='mt-5 mb-8 shadow-lg border-2 border-radixgreen'>
          <div className="flex flex-col items-center">
            <div className='flex justify-center text-radixgreen/80 font-bold'>
              <div className='text-xl mx-1'>
                <div className="flex flex-col items-center">
                  <Text>Repeticiones: </Text>
                  <TextField.Input {...register("reps", {
                    validate: value => (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser mayor que 0",
                  })}></TextField.Input>
                </div>
              </div>
              <div className='text-xl mx-1'>
                <div className="flex flex-col items-center">
                  <Text>Peso: </Text>
                  <TextField.Input 
                  placeholder='En Kg'   
                  {...register("peso", {
                    validate: value => (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser mayor que 0",
                  })} ></TextField.Input>
                </div>
              </div>
              <div className='text-xl mx-1'>
                <div className="flex flex-col items-center">
                  <Text>Duración: </Text>
                  <TextField.Input 
                  placeholder='En segundos'
                  {...register("duration", {
                    validate: value => (value > 0 && Number.isInteger(Number(value))) || "El valor debe ser 0 o un número entero positivo",
                  })} ></TextField.Input>
                </div>
              </div>
            </div>
            <span className={`font-bold ${errors.peso || errors.duration || errors.reps? "text-red-500" : "hidden"} block mb-2`}>
              Todos los campos deben ser mayores que 0
            </span>
          </div>
          <div className='flex justify-center mt-3'>
            <Button onClick={handleSubmit((data) => {
              onSubmit(data);
            })} className='mt-5' size="3">Enviar</Button>
          </div>
        </Card>
      )}
    </div>
  </>
  );
};

export default Series;
