import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromApi } from "../../utils/functions/api";
import { Heading } from "@radix-ui/themes";

export default function GymDetails() {
  const { gymId } = useParams();
  const [gymDetails, setGymDetails] = useState(null);
  const [error, setError] = useState(null);

  // Gym Details
  useEffect(() => {
    getFromApi(`gyms/detail/${gymId}/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Gym details not available");
        }
      })
      .then((data) => {
        setGymDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [gymId]);

  if (error) {
    return (
      <div className="mt-8 p-4 border border-red-500 rounded bg-red-100 text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (!gymDetails) {
    return (
      <div className="mt-8 p-4 border border-yellow-500 rounded bg-yellow-100 text-yellow-700 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <div className="p-10 border border-radixgreen rounded md:m-0 m-5">
        <Heading size="7" className="text-radixgreen !mb-3 text-center">
          Gym Details
        </Heading>
        <div className="mb-4">
          <strong className="text-radixgreen">Nombre:</strong> {gymDetails.name}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Dirección:</strong>{" "}
          {gymDetails.address}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Número de Teléfono:</strong>{" "}
          {gymDetails.phone_number}
        </div>
        <div className="mb-4">
          <strong className="text-radixgreen">Descripción:</strong>{" "}
          {gymDetails.descripcion}
        </div>
      </div>
    </div>
  );
}
