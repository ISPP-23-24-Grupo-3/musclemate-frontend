import React ,{useState, useEffect,useContext} from "react";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";
import { AuthContext } from './AuthContext';

const GymMachineForm = () => {

  const { user } = useContext(AuthContext);
  const [clientDetails, setClientDetails] = useState(null);
  const [gymId, setGymId] = useState(null)
  
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        if (user && user.id) {
          const response = await fetch(`/api/clients/${user.id}/`);
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          const fetchedGymId = data.gym;
          setGymId(fetchedGymId);

          if (fetchedGymId) {
            const gymResponse = await fetch(`/api/gyms/${fetchedGymId}/`);
            if (!gymResponse.ok) {
              throw new Error('Network response was not ok.');
            }
            const gymData = await gymResponse.json();
            const clientDetailsWithGymName = {
              ...data,
              gym_name: gymData.name
            };
            setClientDetails(clientDetailsWithGymName);
          } else {
            setClientDetails(data);
          }
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchClientDetails();
  }, [user]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (machineInfo) => {
    try {
      const response = await fetch('/api/equipments/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: machineInfo.name,
          brand: machineInfo.brand,
          reference: machineInfo.reference,
          description: machineInfo.description,
          muscularGroup: machineInfo.muscularGroup,
          gym: gymId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar la máquina');
      }
  
      console.log('Máquina agregada exitosamente');
    } catch (error) {
      console.error('Hubo un error al agregar la máquina:', error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de la máquina debe tener más de 5 caracteres",
    brand: "La marca debe tener más de 3 caracteres",
    reference: "El número de referencia debe ser único por gimnasio",
    description: "La descripción debe tener más de 10 caracteres",
    muscularGroup: "El grupo muscular debe ser especificado",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-2xl p-10 border border-radixgreen rounded-lg shadow-xl">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Agregar máquina de gimnasio
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center mb-4">
            <label htmlFor="name" className="mr-3">Nombre de la máquina</label>
            <input
              {...register("name", { required: messages.req, minLength: { value: 5, message: messages.name } })}
              name="name"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.name ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              
            />
          </div>
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}

          <div className="flex items-center mb-4">
            <label htmlFor="brand" className="mr-3">Marca</label>
            <input
              {...register("brand", { required: messages.req, minLength: { value: 3, message: messages.brand } })}
              name="brand"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.brand ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "7.5rem" }}
            />
          </div>
          {errors.brand && (
            <p className="text-red-500">{errors.brand.message}</p>
          )}

          <div className="flex items-center mb-4">
            <label htmlFor="reference" className="mr-3">Número de referencia</label>
            <input
              {...register("reference", { required: messages.req })}
              name="reference"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.reference ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "0.4rem" }}
            />
          </div>
          {errors.reference && (
            <p className="text-red-500">{errors.reference.message}</p>
          )}

          <div className="flex items-center mb-4">
            <label htmlFor="description" className="mr-3">Descripción</label>
            <textarea
              {...register("description", { required: messages.req, minLength: { value: 10, message: messages.description } })}
              name="description"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.description ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              rows="4"
            />
          </div>
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <div className="flex items-center mb-4">
            <label htmlFor="muscularGroup" className="mr-3">Grupo muscular</label>
            <input
              {...register("muscularGroup", { required: messages.req })}
              name="muscularGroup"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.muscularGroup ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "3rem" }}
            />
          </div>
          {errors.muscularGroup && (
            <p className="text-red-500">{errors.muscularGroup.message}</p>
          )}

          <div className="flex items-center mb-4">
          <label htmlFor="gym" className="mr-3">Gimnasio</label>
          <select
            {...register("gym", { required: messages.req })}
            name="gym"
            className={`flex-1 px-4 py-3 border rounded-lg ${
              errors.gym ? 'border-red-500' : 'border-radixgreen'
            } bg-white text-black`}
          >
            <option value="">Seleccionar gimnasio</option>
            {clientDetails && (
              <option value={clientDetails.gym}>{clientDetails.gym_name}</option>
            )}
          </select>
        </div>
        {errors.gym && (
          <p className="text-red-500">{errors.gym.message}</p>
        )}

          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full py-3"
          >
            Agregar máquina
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GymMachineForm;