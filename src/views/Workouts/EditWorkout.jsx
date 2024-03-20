import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { Heading, Button } from "@radix-ui/themes";

const EditWorkout = () => {
  const { routineId, workoutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [series, setSeries] = useState([]);
  const [newSeries, setNewSeries] = useState({ reps: 0, weight: 0, date: "", duration: "" });

  useEffect(() => {
    const fetchWorkoutAndSeries = async () => {
      try {
        const workoutResponse = await getFromApi(`workouts/detail/${workoutId}`);
        if (workoutResponse.ok) {
          const workoutData = await workoutResponse.json();
          setWorkout(workoutData);
        }

        const seriesResponse = await getFromApi(`series/?workout=${workoutId}`);
        if (seriesResponse.ok) {
          const seriesData = await seriesResponse.json();
          setSeries(seriesData);
        }
      } catch (error) {
        console.error("Error fetching workout and series:", error);
      }
    };

    fetchWorkoutAndSeries();
  }, [workoutId]);

  const handleAddSeries = async () => {
    try {
      const response = await postToApi("series/create/", {
        ...newSeries,
        workout: workoutId
      });
      if (response.ok) {
        const createdSeries = await response.json();
        setSeries([...series, createdSeries]);
        setNewSeries({ reps: 0, weight: 0, date: "", duration: "" }); // Reset new series form
      } else {
        console.error("Error adding new series:", response.status);
      }
    } catch (error) {
      console.error("Error adding new series:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      {workout && (
        <Heading size="8" className="text-center mb-4">
          {workout.name}
        </Heading>
      )}
      <ul>
        {series.map((serie) => (
          <li key={serie.id}>
            <p>Reps: {serie.reps}</p>
            <p>Weight: {serie.weight}</p>
            <p>Date: {serie.date}</p>
            <p>Duration: {serie.duration}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="number"
          value={newSeries.reps}
          onChange={(e) => setNewSeries({ ...newSeries, reps: e.target.value })}
          placeholder="Reps"
        />
        <input
          type="number"
          value={newSeries.weight}
          onChange={(e) => setNewSeries({ ...newSeries, weight: e.target.value })}
          placeholder="Weight"
        />
        <input
          type="text"
          value={newSeries.date}
          onChange={(e) => setNewSeries({ ...newSeries, date: e.target.value })}
          placeholder="Date (yyyy/MM/dd)"
        />
        <input
          type="text"
          value={newSeries.duration}
          onChange={(e) => setNewSeries({ ...newSeries, duration: e.target.value })}
          placeholder="Duration"
        />
        <Button onClick={handleAddSeries}>Add Series</Button>
      </div>
    </div>
  );
};

export default EditWorkout;
