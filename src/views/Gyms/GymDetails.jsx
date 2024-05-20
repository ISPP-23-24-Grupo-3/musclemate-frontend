import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getFromApi, deleteFromApi } from "../../utils/functions/api";
import { Button, Heading } from "@radix-ui/themes";
import { FormContainer } from "../../components/Form";

export default function GymDetails() {
  const { gymId } = useParams();
  const [gymDetails, setGymDetails] = useState(null);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getFromApi(`gyms/detail/${gymId}/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Detalles del gimnasio no disponibles");
        }
      })
      .then((data) => {
        setGymDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [gymId]);

  const handleDeleteGym = async () => {
    try {
      const response = await deleteFromApi(`gyms/delete/${gymId}/`);
      if (response.ok) {
        // Si la eliminación es exitosa, redirige al usuario a la lista de gimnasios
        setDeleteSuccess(true);
        setTimeout(() => {
          navigate("/owner/my-gyms");
        }, 2000); // Espera 2 segundos antes de redirigir
        return;
      }
      // Si la respuesta no fue exitosa, se ejecutará el código a continuación
    } catch (error) {
      // Si hay un error durante la solicitud, se ejecutará el código a continuación
      setError("Error al eliminar el gimnasio.");
      return;
    }
    // Si la ejecución llega a este punto, significa que hubo un problema durante la eliminación
    setError("Error al eliminar el gimnasio."); // Muestra un mensaje de error genérico
  };

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
        Cargando...
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-xl mx-auto">
      {deleteSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">¡Éxito!</strong>
          <span className="block sm:inline">
            {" "}
            El gimnasio se ha eliminado correctamente.
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
              <title>Cerrar</title>
              <path d="M14.354 5.354a2 2 0 00-2.828 0L10 7.172 7.172 5.354a2 2 0 10-2.828 2.828L7.172 10l-2.828 2.828a2 2 0 102.828 2.828L10 12.828l2.828 2.828a2 2 0 102.828-2.828L12.828 10l2.828-2.828a2 2 0 000-2.828z" />
            </svg>
          </span>
        </div>
      )}
      <FormContainer className="">
        <Heading size="7" className="text-radixgreen !mb-3 text-center">
          Detalles del Gimnasio
        </Heading>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <strong className="text-radixgreen">Nombre</strong>
            {gymDetails.name}
          </div>
          <div className="flex flex-col">
            <strong className="text-radixgreen">Dirección</strong>{" "}
            {gymDetails.address}
          </div>
          <div className="flex flex-col">
            <strong className="text-radixgreen">Número de Teléfono</strong>{" "}
            {gymDetails.phone_number}
          </div>
          <div className="flex flex-col">
            <strong className="text-radixgreen">Descripción</strong>{" "}
            {gymDetails.descripcion}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <Link to={`../gyms/${gymId}/stats`}>
              <Button
                className="text-white font-bold py-2 px-4 rounded"
              >
                Ver Estadísticas
              </Button>
            </Link> 
            <Button
              color="red"
              className="w-1/2 self-center"
              onClick={handleDeleteGym}
            >
              Eliminar Gimnasio
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
