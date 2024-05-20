import React, { useEffect, useState } from "react";
import { Button, Text, Heading, Flex } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";
import { EquipmentSelect } from "../../components/Equipments";
import { RingLoader } from "react-spinners"; // Importa el componente del spinner

import { Line } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

const ShowStatistics = () => {
    const [workouts, setWorkouts] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [series, setSeries] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [tipo, setTipo] = useState("peso");
    const [equipment, setEquipment] = useState([]);

    const [loading, setLoading] = useState(false); // Estado para controlar el spinner

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await getFromApi(`routines/`);
                if (response.ok) {
                    let data = await response.json();
                    setRoutines(data);
                } else {
                    console.error("Error fetching API workouts:", response.status);
                }
            } catch (error) {
                console.error("Error fetching API workouts:", error);
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
                    const response = await getFromApi(
                        `workouts/byRoutine/${routine.id}/`
                    );
                    if (response.ok) {
                        let data = await response.json();

                        workouts.push(...data);
                    } else {
                        console.error("Error fetching API workouts:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching API workouts:", error);
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
                    let workoutId = workout.id;
                    const name = await equipmentName(workout.equipment);
                    const response = await getFromApi(`series/workout/${workoutId}/`);
                    if (response.ok) {
                        let data = await response.json();
                        let dataWithEquipment = data.map((serie) => ({
                            id: serie.id,
                            reps: serie.reps,
                            weight: serie.weight,
                            date: serie.date,
                            equipment: name,
                            duration: serie.duration,
                        }));
                        serie.push(...dataWithEquipment);
                        data.sort((a, b) => new Date(a.date) - new Date(b.date));
                        let workoutChartData = data.map((serie) => ({
                            reps: serie.reps,
                            weight: serie.weight,
                            date: serie.date,
                        }));
                        if (workout.equipment.includes(Number(equipment))) {
                            chartData.push(...workoutChartData);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching API workout:", error);
                }
            }
            chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
            setChartData(chartData);
        };
        fetchSeries();
    }, [workouts, equipment]);

    const equipmentName = async (equipmentsId) => {
        let equipName = [];
        if (equipmentsId.length > 0) {
            for (let i = 0; i < equipmentsId.length; i++) {
                const response = await getFromApi(
                    "equipments/detail/" + equipmentsId[i] + "/"
                );
                if (response.ok) {
                    let data = await response.json();
                    if (i < equipmentsId.length - 1) {
                        equipName.push(data.name + ", ");
                    } else {
                        equipName.push(data.name);
                    }
                }
            }
        } else {
            let equipName = "Sin máquinas asignadas";
            return equipName;
        }
        return equipName;
    };

    useEffect(() => {
        const fetchSeries = async () => {
            let chartData = [];
            let serie = [];
            for (let workout of workouts) {
                try {
                    let workoutId = workout.id;
                    const name = await equipmentName(workout.equipment);
                    const response = await getFromApi(`series/workout/${workoutId}/`);
                    if (response.ok) {
                        let data = await response.json();
                        let dataWithEquipment = data.map((serie) => ({
                            id: serie.id,
                            reps: serie.reps,
                            weight: serie.weight,
                            date: serie.date,
                            equipment: name,
                            duration: serie.duration,
                        }));
                        serie.push(...dataWithEquipment);
                        data.sort((a, b) => new Date(a.date) - new Date(b.date));
                    }
                } catch (error) {
                    console.error("Error fetching API workout:", error);
                }
            }
            serie.sort((a, b) => new Date(b.date) - new Date(a.date));
            setSeries(serie);
        };
        fetchSeries();
    }, [workouts]);

    const showLoading = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    return (
        <>
            <Heading size="8" className="text-radixgreen flex items-center justify-center">Tu Evolución</Heading>
            <div className="flex items-center justify-center">
                <div className="mr-4 mt-5">
                    <EquipmentSelect
                        onChange={(e) => {
                            showLoading();
                            setEquipment(e.target.value);
                        }}
                    />
                </div>
                <div className="mt-5">
                    {tipo === "peso" ? (
                        <Button
                            onClick={() => { setTipo("reps"), showLoading() }}
                            className="w-full"
                            size="4"
                        >
                            <Text>Mostrar Repes</Text>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => { setTipo("peso"), showLoading() }}
                            className="w-full"
                            size="4"
                        >
                            <Text>Mostrar Pesos</Text>
                        </Button>
                    )}
                </div>
            </div>
            {loading ? (
                <Flex justify="center" className="mt-7">
                    <RingLoader color="#30A46C" loading={loading} size={30} />
                </Flex>
            ):
            <div className="mt-7">
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
                                    label: `Mis ${tipo == "peso" ? "pesos" : "repeticiones"}`,
                                    data: chartData.map((serie) =>
                                        tipo == "peso" ? serie.weight : serie.reps
                                    ),
                                    fill: true,
                                    borderColor: "rgb(48, 164, 108)",
                                    backgroundColor: "rgba(48, 164, 108, 0.4)",
                                },
                            ],
                        }}
                    />
                ) : (
                    <div style={{ color: "red", fontSize: "18px", textAlign: "center" }}>
                        {loading ? "Cargando..." : "No hay datos para mostrar"}{" "}
                    </div>
                )}
            </div>
            }
            <div className="text-radixgreen mt-7 mb-5 mx-auto text-center">
                <Heading size="8">Historial de tus ejercicios</Heading>
            </div>
            <div className="mx-auto mt-1 m-5">
                <ul className="mt-1">
                    {series.length > 0 ? (
                        series.map((serie) => (
                            <li
                                key={serie.id}
                                className={`bg-white p-4 rounded-md mb-4`}
                                style={{
                                    boxShadow:
                                        "0px 4px 6px rgba(0, 0, 0, 0.1), 0px -2px 2px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <div className="grid md:grid-cols-4 md:grid-rows-1 md:gap-0 gap-3 grid-cols-2 grid-rows-2">
                                    <div
                                        className={`flex-col justify-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}
                                    >
                                        <p>Fecha de creación:</p>
                                        <span className="text-black md:text-lg text-sm">
                                            {serie.date}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex-col justify-center items-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}
                                    >
                                        <p>Repeticiones:</p>
                                        <span className="text-black md:text-lg text-sm">
                                            {serie.reps}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex-col justify-center items-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}
                                    >
                                        <p>Peso:</p>
                                        <span className="text-black md:text-lg text-sm">
                                            {serie.weight}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex-col justify-center items-center text-radixgreen font-bold mb-1 md:text-xl text-sm`}
                                    >
                                        <p>Entrenamiento:</p>
                                        <span className="text-black md:text-lg text-sm">
                                            {serie.equipment}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-red-500">
                            El historial está vacío porque aún no ha creado ninguna serie
                        </p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default ShowStatistics;
