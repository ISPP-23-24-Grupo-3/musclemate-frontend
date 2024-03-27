import React,{useState, useEffect,useContext} from "react";
import { HiUser, HiLockClosed, HiOutlineMail,HiPhone, } from "react-icons/hi";
import { HiBuildingOffice2,HiHome,HiMiniCake,HiMiniIdentification   } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";




const UserRegister = () => {

  const { user } = useContext(AuthContext);
  const [gyms, setGyms] = useState(null);
  const navigate = useNavigate();
  const [selectedGym, setSelectedGym] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function getGyms() {
  
    const responseGym = await getFromApi('gyms/');
    const gymsData = await responseGym.json();
    console.log(gymsData); 
    return gymsData;
  }

  useEffect(() => {
    getGyms().then(gyms => setGyms(gyms)).catch(error => console.log(error));
    }, []);



  const { register, handleSubmit, formState: { errors } } = useForm({values: {gym: selectedGym}},);

  const onSubmit = async (formData) => {
    try {
      const { name, lastName, email, birth, gender, phoneNumber, address, city, zipCode, username, password, gym } = formData;
      
      const requestBody = {
        name,
        lastName,
        email,
        birth,
        gender,
        phoneNumber,
        address,
        city,
        zipCode,
        userCustom: {
          username,
          password
        },
        gym
      };
      
      const response = await postToApi('clients/create/', requestBody);
  
      if (!response.ok) {
        const responseData = await response.json();
        setErrorMessage(responseData.username[0]);
        return;
      }
  
      console.log('Usuario creado exitosamente');
      navigate('/owner/users');
    } catch (error) {
      console.error('Hubo un error al crear el usuario:', error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de usuario tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
    phoneNumber: "Tiene que ser un numero de 9 cifras"
  };

  const patterns = {
    mail: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    phoneNumber: /^\d{9}$/,
  };

  return (
    <div className="flex justify-center items-center min-h-screen md:m-0 m-5">
      <div className="max-w-2xl p-10 border border-radixgreen rounded-lg shadow-xl">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Registro de nuevo usuario
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative flex items-center">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="name">Nombre</label>
            <input
              {...register("name", {
                required: messages.req
              })}
              name="name"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.name ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "2.5rem" }}
            />
          </div>
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}

          <div className="relative flex items-center">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="lastName">Apellidos</label>
            <input
              {...register("lastName", {
                required: messages.req
              })}
              name="lastName"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.lastName ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "2rem" }}
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}

          <div className="relative flex items-center">
            <HiOutlineMail className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="email">Correo electrónico</label>
            <input
              {...register("email", {
                required: messages.req,
                pattern: { value: patterns.mail, message: messages.mail },
              })}
              name="email"
              type="email"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.email ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "0.5rem" }}
            />
          </div>
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <div className="relative flex items-center">
            <HiMiniCake className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="birth">Fecha de nacimiento</label>
            <input
              {...register("birth", {
                required: messages.req
              })}
              name="birth"
              type="date"
              className="w-full px-4 py-3 border rounded-lg g-white text-black"
            />
          </div>
          {errors.birth && (
          <p className="text-red-500">{errors.birth.message}</p>
          )}


          <div className="relative flex items-center">
              <HiMiniIdentification className="w-6 h-6 text-radixgreen mr-3" />
              <label htmlFor="gender">Género</label>
              <select
                {...register("gender")}
                name="gender"
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.gender ? 'border-red-500' : 'border-radixgreen'
                } bg-white text-black`}
                style={{ marginLeft: "3rem" }}
              >
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
          </div>
          {errors.gender && (
            <p className="text-red-500">{errors.gender.message}</p>
          )}

          <div className="relative flex items-center">
            <HiPhone className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="phoneNumber">Número de telefono</label>
            <input
              {...register("phoneNumber", {
                required: messages.req,
                pattern: { value: patterns.phoneNumber, message: messages.phoneNumber}
              })}
              name="phoneNumber"
              type="number"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.phoneNumber ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "0rem" }}
            />
          </div>
          {errors.phoneNumber && (
          <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}

          <div className="relative flex items-center">
            <HiHome className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="address">Dirección</label>
            <input
              {...register("address", {
                required: messages.req,
              })}
              name="address"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.address ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "2.10rem" }}
            />
          </div>
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}

          <div className="relative flex items-center">
            <HiBuildingOffice2 className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="city">Ciudad</label>
            <input
              {...register("city", {
                required: messages.req,
              })}
              name="city"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.city ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "3.10rem" }}
            />
          </div>
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}

          <div className="relative flex items-center">
            <HiBuildingOffice2 className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="zipCode">Código Postal</label>
            <input
              {...register("zipCode", {
                required: messages.req,
                minLength: {
                  value: 5,
                  message: "El código postal tiene que estar compuesto por 5 dígitos"
                }
              })}
              name="zipCode"
              type="number"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.zipCode ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "3.10rem" }}
            />
          </div>
          {errors.zipCode && (
          <p className="text-red-500">{errors.zipCode.message}</p>
          )}

        <div className="relative flex items-center mb-4">
          <HiHome className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="username" className="mr-3">Nombre de usuario</label>
            <input
              {...register("username", {
                required: messages.req,
              })}
              name="username"
              type="text"
              className={`w-full pl-4 pr-100000 px-4 py-3 border rounded-lg ${
                errors.username ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "3rem" }}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 absolute mt-1 ml-3">{errors.username.message}</p>
          )}
          {errorMessage && <p className="text-red-500 mt-1 ml-3">{errorMessage}</p>}


          <div className="relative flex items-center mb-4">  
          <HiLockClosed className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="password" className="mr-3">Contraseña</label>  
            <input
              {...register("password", {
                required: messages.req,
                minLength: {
                  value: 10,
                  message: "La contraseña debe tener más de 10 caracteres"
                }
              })}
              name="password"
              type="password"
              className={`w-full pl-4 pr-100000 px-4 py-3 border rounded-lg ${
                errors.password ? 'border-red-500' : 'border-radixgreen'
              } bg-white text-black`}
              style={{ marginLeft: "3rem" }}
            />
          </div>
          {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
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
            Registrarse
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
