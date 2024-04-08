import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Heading } from "@radix-ui/themes";
import { getFromApi } from '../../utils/functions/api';

import { Line, Bar } from 'react-chartjs-2';
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
    const [gymStats, setGymStats] = useState([]);

    const [agrupado, setAgrupado] = useState([]);

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

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
        getFromApi(`gyms/usage/${gymId}/year/${year}/`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Estadísticas no disponibles");
                }
            })
            .then((data) => {
                let groupedData = {};

                for (let i = 0; i < data.length; i++) {
                    if (!groupedData[data[i].equipment_name]) {
                        groupedData[data[i].equipment_name] = {
                        month: [],
                        total: Array(12).fill(0),
                        };
                    }
                    const monthIndex = data[i].month - 1; 
                    groupedData[data[i].equipment_name].month.push(data[i].month);
                    groupedData[data[i].equipment_name].total[monthIndex] = data[i].total;
                }

                let result = Object.keys(groupedData).map(key => ({
                equipment_name: key,
                ...groupedData[key]
                }));

                console.log(result);
                setGymStats(result);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [year]);
    
    useEffect(() => {
        for (let i = 0; i < gymStats.length; i++) {

            let total = 0;
            for (let j = 0; j < months.length; j++) {
                if (gymStats[i].month === months[j]) {
                    total = gymStats[i].total;
                }
            }
            agrupado.push({
                equipment_name: gymStats[i].equipment_name,
                total: total,
            });
        }
        setAgrupado(agrupado);
    }, []);

    return(
        <div className="mt-8 max-w-xl mx-auto">
            <Link to={`../gyms/${gymId}`}>
                <Button className="text-white font-bold py-2 px-4 rounded">
                    Volver
                </Button>
            </Link>
            <Heading size="7" className="text-radixgreen !mb-3 text-center">
                Estadísticas de Uso de Máquinas
            </Heading>  
            <div className='text-right mt-5 mb-5' >
                <h1 className="text-radixgreen font-bold mb-1 text-right">Seleccione un Año</h1>
                <select defaultValue={currentYear} onChange={(e) => setYear(e.target.value)} >
                    {yearList.map((year, index) => (
                        <option key={index} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            
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
                    datasets: gymStats.map((machine) => ({
                        label: machine.equipment_name,
                        data: machine.total,
                        fill: true,
                        borderColor: getColor(),
                        backgroundColor: `${getColor()}80`,
                    })),
                }}
            />
            
        </div>
    );

}