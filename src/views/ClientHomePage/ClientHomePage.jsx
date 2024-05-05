import { Button, Container, Text, Heading, Link, IconButton } from "@radix-ui/themes";
import { React, useContext, useEffect, useState } from "react";
import { RoutineList } from "../../components/Routines/RoutineList";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, deleteFromApi } from "../../utils/functions/api";
import { EquipmentSelect } from "../../components/Equipments";
import { IoPodiumOutline, IoCalendarClearOutline, IoBarbellOutline } from "react-icons/io5";
import { CgTrash } from "react-icons/cg";
import { FormContainer } from "../../components/Form.jsx";

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
  const [reservation, setReservations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [error, setError] = useState(null);

  const equipmentName = async (equipmentsId) => {
    let equipName = []
    if (equipmentsId.length > 0) {
      for (let i = 0; i < equipmentsId.length; i++) {
        const response = await getFromApi("equipments/detail/" + equipmentsId[i] + "/");
        if (response.ok) {
          let data = await response.json();
          if (i < equipmentsId.length - 1) {
            equipName.push(data.name + ", ");
          }
          else {
            equipName.push(data.name);
          }
        }
      }
    }
    else {
      let equipName = "Sin máquinas asignadas";
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
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      let workouts = [];
      for (let routine of routines) {
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
  }, [routines]);


  useEffect(() => {
    const fetchSeries = async () => {
      let chartData = [];
      let serie = [];
      for (let workout of workouts) {
        try {
          let workoutId = workout.id
          const name = await equipmentName(workout.equipment);
          const response = await getFromApi(`series/workout/${workoutId}/`);
          if (response.ok) {
            let data = await response.json();
            let dataWithEquipment = data.map(serie => ({
              id: serie.id,
              reps: serie.reps,
              weight: serie.weight,
              date: serie.date,
              equipment: name,
              duration: serie.duration,
            }));
            serie.push(...dataWithEquipment)
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            let workoutChartData = data.map(serie => ({
              reps: serie.reps,
              weight: serie.weight,
              date: serie.date,
            }));
            if (workout.equipment.includes(Number(equipment))) {
              chartData.push(...workoutChartData);
            }
          }
        } catch (error) {
          console.error('Error fetching API workout:', error);
        }
      }
      chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData(chartData);
    };
    fetchSeries();
  }, [workouts, equipment]);

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

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await getFromApi("events/reservation/");
      const fetchedReservations = await response.json();
      return fetchedReservations;
    };

    fetchReservations().then((r) => setReservations(r));
  }, []);


  const handleDelete = async (event) => {
    try {
      const response_reservation = await getFromApi(`reservations/byClientEvent/${event.id}/`);
      if (response_reservation.ok) {
        const reservation_delete = await response_reservation.json();
        const response = await deleteFromApi(`reservations/delete/${reservation_delete[0].id}/`);
        if (response.ok) {
          // Si la eliminación es exitosa, mostramos el mensaje de éxito
          setDeleteSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 2500);
          return;
        }
      }
      // Si la respuesta no fue exitosa, se ejecutará el código a continuación
    } catch (error) {
      // Si hay un error durante la solicitud, se ejecutará el código a continuación
      setError("Error al eliminar el equipo.");
      return;
    }
    // Si la ejecución llega a este punto, significa que hubo un problema durante la eliminación
    setError("Error al eliminar el equipo."); // Muestra un mensaje de error genérico
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div style={{ flex: '1' }}>
          <Heading as="h1">
            <Link className="!mb-5 bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
              href="./routines">
              <IoBarbellOutline className="w-8 h-8" />
              <h3 className="text-lg font-semibold text-radixgreen">Mis Rutinas</h3>
            </Link>
          </Heading>
          {gymPlan !== "free" ? (
            <RoutineList />
          ) : (
            <div className="text-red-700">La subscripción de tu gimnasio no incluye esta funcionalidad.</div>
          )}
        </div>
        <div style={{ flex: '1' }}>
          <Heading as="h1">
            <Link className="!mb-5 bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
              href="./events">
              <IoCalendarClearOutline className="w-8 h-8" />
              <h3 className="text-lg font-semibold text-radixgreen">Mis Eventos</h3>
            </Link>
          </Heading>
          {deleteSuccess && (
            <FormContainer role="alert">
              <strong className="font-bold">Éxito!</strong>
              <span className="block sm:inline">
                {" "}
                La reserva ha sido eliminada correctamente.
              </span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setDeleteSuccess(false)}
              >
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.354 5.354a2 2 0 00-2.828 0L10 7.172 7.172 5.354a2 2 0 10-2.828 2.828L7.172 10l-2.828 2.828a2 2 0 102.828 2.828L10 12.828l2.828 2.828a2 2 0 102.828-2.828L12.828 10l2.828-2.828a2 2 0 000-2.828z" />
                </svg>
              </span>
            </FormContainer>
          )}
          <div>
              {reservation[0] ? (reservation.map((event) => (
                  <Link to={`/user/reservations/${event.id}`} key={event.id}>
                    <Button
                      name="event"
                      key={event.id}
                      size="3"
                      variant="soft"
                      className="flex !justify-between !h-fit !p-2 !px-4 w-full"
                    >
                      <div className="flex flex-col justify-between items-start">
                        <p className="font-semibold">{event.name}</p>
                        <p>{event.date}</p>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <IconButton
                          size="3"
                          radius="full"
                          color="red"
                          onClick={() => {
                            handleDelete(event);
                          }}
                        >
                          <CgTrash className="size-6" />
                        </IconButton>
                      </div>
                    </Button>
                  </Link>
                )))
                :
              (<div style={{ color: 'red', fontSize: '18px', textAlign: 'center' }}>No hay reservas para mostrar</div>)
}
          </div>
        </div>
        <div style={{ flex: '1' }}>
          <Heading as="h1">
            <Link className="!mb-5 bg-[#E6F6EB] rounded-lg p-6 shadow-sm border-2 border-opacity-20 border-radixgreen hover:shadow-md transition-shadow flex flex-col items-center gap-4"
              href="./statistics">
              <IoPodiumOutline className="w-8 h-8" />
              <h3 className="text-lg font-semibold text-radixgreen">Mi Historial</h3>
            </Link>
          </Heading>
          <div className="flex items-center justify-center">
            <div className="mr-4 mt-2">
              <EquipmentSelect onChange={(e) => { setEquipment(e.target.value) }} />
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
              (<div style={{ color: 'red', fontSize: '18px', textAlign: 'center' }}>No hay datos para mostrar</div>)
            }
          </div>
        </div>
      </div>
    </>
  );
}
