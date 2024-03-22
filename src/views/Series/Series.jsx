import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFromApi } from '../../utils/functions/api';

const Series = () => {
  const { workoutId } = useParams();
  const [series, setSeries] = useState([]);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await getFromApi(`series/workout/${workoutId}/`);
        if (response.ok) {
          const data = await response.json();
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

  return (
    <div className="max-w-lg mx-auto mt-8 m-5">
      <h2 className="text-radixgreen mt-8 mb-3 text-center md:text-left">Series para el Entrenamiento {workoutId}</h2>
      <ul>
        {apiDataLoaded && series.length > 0 ? (
          series.map((serie) => (
            <li key={serie.id} className="bg-white shadow-md p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <div>
                  <div className="mr-4">
                    <p className="text-radixgreen font-bold mb-1">
                      Repeticiones: <span className="text-black">{serie.reps}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-radixgreen font-bold mb-1">
                      Peso: <span className="text-black">{serie.weight}</span>
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
