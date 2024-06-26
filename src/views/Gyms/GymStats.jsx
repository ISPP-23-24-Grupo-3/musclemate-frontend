import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Heading } from "@radix-ui/themes";
import { getFromApi } from '../../utils/functions/api';

import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    BarElement,
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
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export default function GymStats() {

    const { gymId } = useParams();
    const [machines, setMachines] = useState([]);
    const [gymMonthStats, setGymMonthStats] = useState([]);
    const [orderedGymMonthStats, setOrderedGymMonthStats] = useState([]);
    const [gymYearStats, setGymYearStats] = useState([]);
    const [actualMachines, setActualMachines] = useState([]);
    const [daily, setDaily] = useState(false);
    const [dailyStats, setDailyStats] = useState([]);

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const [month, setMonth] = useState("ANUAL");
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const yearList = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    function getColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        if (month === 'ANUAL') {
            getFromApi(`gyms/usage/${gymId}/year/${year}/`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Estadísticas no disponibles");
                }
            })
            .then((data) => {
                let groupedYearData = {};

                for (let i = 0; i < data.length; i++) {
                    if (!groupedYearData[data[i].equipment_name]) {
                        groupedYearData[data[i].equipment_name] = {
                        month: [],
                        total: Array(12).fill(0),
                        };
                    }
                    const monthIndex = data[i].month - 1; 
                    groupedYearData[data[i].equipment_name].month.push(data[i].month);
                    groupedYearData[data[i].equipment_name].total[monthIndex] = data[i].total;
                }

                let resultYear = Object.keys(groupedYearData).map(key => ({
                equipment_name: key,
                ...groupedYearData[key]
                }));
                console.log(resultYear);
                setGymYearStats(resultYear);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [year]);

    useEffect(() => {
        if (month != 'ANUAL') {
            getFromApi(`gyms/usage/${gymId}/year/${year}/month/${month}/`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Estadísticas no disponibles");
                    }
                })
                .then((data) => {
                    let groupedMonthData = {};

                    for (let i = 0; i < data.length; i++) {
                        if (!groupedMonthData[data[i].equipment_name]) {
                            groupedMonthData[data[i].equipment_name] = {
                                total: 0,
                            };
                        }
                        groupedMonthData[data[i].equipment_name].total += data[i].total;
                    }

                    let resultMonth = Object.keys(groupedMonthData).map(key => ({
                    equipment_name: key,
                    total: groupedMonthData[key].total,
                    }));

                    setGymMonthStats(resultMonth);
                })
        }
        if(month === 'ANUAL'){
            setGymMonthStats([]);
        }
    }, [month, year]);

    useEffect(() => {
        getFromApi(`equipments/`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Gimnasio no encontrado");
                }
            })
            .then((data) => {
                setMachines(data.filter((equipment) => equipment.gym === Number(gymId)).map((equipment) => equipment.name));
            })
            .catch((error) => {
                console.error(error);
            });
        ChartJS.defaults.font.size = 14;
    }, []);

    useEffect(() => {
        let orderedStats = gymMonthStats.map(machine => {
                return {
                    equipment_name: machine.equipment_name,
                    total: Array(gymMonthStats.length).fill(0).map((_, index) => index === gymMonthStats.indexOf(machine) ? machine.total : 0),
                };
        });
        setOrderedGymMonthStats(orderedStats);
        setActualMachines(gymMonthStats.map(machine => machine.equipment_name));
    }, [gymMonthStats, machines]);

    useEffect(() => {
        if (daily && month != 'ANUAL') {
            getFromApi(`gyms/usage/${gymId}/year/${year}/month/${month}/daily/`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Estadísticas no disponibles");
                    }
                })
                .then((data) => {
                    let groupedDailyData = {};
                    let machs= [];
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].daily_usage.length > 0) {
                            for (let j = 0; j < data[i].daily_usage.length; j++) {
                                if(!machs.includes(data[i].daily_usage[j][0])) {
                                    machs.push(data[i].daily_usage[j][0]);
                                }
                            }
                        }
                    }
                    for (let i = 0; i < machs.length; i++) {
                        groupedDailyData[machs[i]] = new Array(31).fill(0);
                    }
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < data[i].daily_usage.length; j++) {
                            if (groupedDailyData.hasOwnProperty(data[i].daily_usage[j][0])) {
                                groupedDailyData[data[i].daily_usage[j][0]][i] = data[i].daily_usage[j][1];
                            }
                        }
                    }
                    setDailyStats(groupedDailyData);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [daily, month, year]);

    useEffect(() => {
        if (month === 'ANUAL') {
            setDaily(false);
        }
    }, [month]);

    return(
        <div className="mt-8 max-w-xl mx-auto">
            <div style={{display: 'flex', justifyContent: 'flex-end'}}> 
                <Link to={`../gyms/${gymId}`}>
                    <Button className="text-white font-bold py-2 px-4 rounded">
                        Volver
                    </Button>
                </Link>
            </div>
            {month === 'ANUAL' ? (
                <Heading className="text-radixgreen !mt-5 !mb-3 text-center">
                    Estadísticas de Uso de Máquinas en el Año {year}
                </Heading>
            ) : (
                <Heading className="text-radixgreen !mt-5 !mb-3 text-center">
                    Estadísticas de Uso de Máquinas en {months[month-1]} de {year}
                </Heading>
            )}
            <div style={{display: "flex", justifyContent: "right", marginTop: 5, marginBottom: 8}}>
                {month != 'ANUAL' ? (
                    <div className='text-right mr-5' style={{ display:'flex', alignItems: "flex-start"}}>
                        <h1 className="text-radixgreen font-bold mb-1 mr-3 text-right">Mostrar Uso Diario</h1>
                        <input style={{ transform: 'scale(1.3)' }} className="mt-1" type="checkbox" checked={daily} onChange={() => setDaily(!daily)} />
                    </div>
                ) : null }
                <div className='text-right mr-5'>
                    <h1 className="text-radixgreen font-bold mb-1 text-right">Seleccione un Mes</h1>
                    <select defaultValue={month} onChange={(e) => setMonth(e.target.value === 'ANUAL' ? e.target.value : Number(e.target.value) + 1)} >
                        <option value="ANUAL">ANUAL</option>
                        {months.map((month, index) => (
                            <option key={index} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='text-right ml-5' >
                    <h1 className="text-radixgreen font-bold mb-1 text-right">Seleccione un Año</h1>
                    <select defaultValue={currentYear} onChange={(e) => setYear(e.target.value)} >
                        {yearList.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {month === 'ANUAL' ? (
                <div className='mt-5'>
                    <Bar
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }} 
                        data={{
                            labels: months,
                            datasets: gymYearStats.map((machine) => ({
                                label: machine.equipment_name,
                                data: machine.total,
                                fill: true,
                                backgroundColor: getColor(),
                            })),
                        }}
                    />
                </div>
            ) : (
                <div className='mt-5'>
                    {daily ? (
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
                                labels: Array.from({length: 31}, (_, i) => i + 1),
                                datasets: Object.keys(dailyStats).map((key) => ({
                                    label: key,
                                    data: dailyStats[key],
                                    fill: false,
                                    backgroundColor: getColor(),
                                }))
                            }}
                        />
                    ) : (
                        <Bar
                            options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }} 
                            data={{
                                labels: actualMachines,
                                datasets: orderedGymMonthStats.map((machine) => ({
                                    label: machine.equipment_name,
                                    data: machine.total,
                                    fill: true,
                                    backgroundColor: getColor(),
                                })),
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );

}