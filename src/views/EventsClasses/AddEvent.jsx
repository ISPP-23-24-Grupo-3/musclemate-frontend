import React ,{useState, useEffect,useContext} from "react";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import {
    HiBuildingOffice2,
    HiHome,
    HiMiniCake,
    HiMiniIdentification,
  } from "react-icons/hi2";
  import { HiUser, HiOutlineMail, HiPhone } from "react-icons/hi";

const AddEventsForm = () => {



  const { user } = useContext(AuthContext);
  const [gyms, setGyms] = useState(null)
  const [selectedGym, setSelectedGym] = useState(null);
  const navigate = useNavigate()


  async function getGyms() {
  
          const responseGym = await getFromApi('gyms/');
          return responseGym.json();
         
  }

  useEffect(() => {
    getGyms().then(gyms => setGyms(gyms)).catch(error => console.log(error));
    }, []);


  const { register, handleSubmit, formState: { errors } } = useForm( {values: {gym: selectedGym}},);

  const onSubmit = async (eventInfo) => {
    try {
      const durationHours = Math.floor(eventInfo.duration / 60);
      const durationMinutes = eventInfo.duration % 60;
      const durationSeconds = 0;
      const formattedDuration = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
  
      
      const eventData = { ...eventInfo, duration: formattedDuration };
  
      const response = await postToApi('events/create/', eventData);
  
      if (!response.ok) {
        throw new Error('Error al crear evento');
      }
  
      console.log('Evento creado exitosamente');
      // navigate('/owner/equipments');
    } catch (error) {
      console.error('Hubo un error al crear el evento:', error);
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
          Crear evento
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center mb-4">
            <label htmlFor="name" className="mr-3">Titulo del evento</label>
            <input
              {...register("name", { required: messages.req})}
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
            <label htmlFor="capacity" className="mr-3">Aforo</label>
            <input
              {...register("capacity", { required: messages.req })}
              name="capacity"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.capacity ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "0.4rem" }}
            />
          </div>
          {errors.capacity && (
            <p className="text-red-500">{errors.capacity.message}</p>
          )}
          
          <div className="flex items-center mb-4">
            <label htmlFor="attendees" className="mr-3">Asistentes</label>
            <input
              {...register("attendees")}
              name="attendees"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.attendees ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "0.4rem" }}
            />
          </div>

          <div className="flex items-center mb-4">
            <label htmlFor="instructor" className="mr-3">Monitor</label>
            <input
              {...register("instructor", { required: messages.req})}
              name="instructor"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.instructor ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              
            />
          </div>
          {errors.instructor && (
            <p className="text-red-500">{errors.instructor.message}</p>
          )}
          
          <div className="relative flex items-center">
            <HiMiniCake className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="date">Fecha del evento</label>
            <input
              {...register("date", {
                required: messages.req
              })}
              name="date"
              type="date"
              className="w-full px-4 py-3 border rounded-lg g-white text-black"
            />
          </div>

          <div className="flex items-center mb-4">
            <label htmlFor="duration" className="mr-3">Duración (en minutos)</label>
            <input
              {...register("duration", { required: "Este campo es obligatorio" })}
              name="duration"
              type="number"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.duration ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
            />
          </div>
          {errors.duration && (
            <p className="text-red-500">{errors.duration.message}</p>
          )}

          <div className="flex items-center mb-4">
            <label htmlFor="intensity" className="mr-3">Intensidad del evento</label>
            <select
              {...register("intensity", { required: messages.req })}
              name="intensity"
              type="text"
              className={`flex-1 px-4 py-3 border rounded-lg ${
                errors.intensity ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "3rem" }}
              
            >
            <option value="">Selecciona una intensidad</option>
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="H">High</option>
            </select>
          </div>
          {errors.intensity && (
            <p className="text-red-500">{errors.intensity.message}</p>
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
            {gyms && gyms.map(gym=><option key={gym.id} value={gym.id}>{gym.name}</option>)}
            
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

export default AddEventsForm;