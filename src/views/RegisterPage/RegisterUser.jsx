import { HiUser, HiOutlineMail, HiPhone } from "react-icons/hi";
import {
  HiBuildingOffice2,
  HiHome,
  HiMiniCake,
  HiMiniIdentification,
} from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button } from "@radix-ui/themes";

const UserRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (userInfo) => console.log(userInfo);

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de usuario tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
    phone: "Tiene que ser un numero de 9 cifras",
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
            <label htmlFor="userName">Nombre</label>
            <input
              {...register("userName", {
                required: messages.req,
              })}
              name="userName"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.userName ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "2.5rem" }}
            />
          </div>
          {errors.userName && (
            <p className="text-red-500">{errors.userName.message}</p>
          )}

          <div className="relative flex items-center">
            <HiUser className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="lastname">Apellidos</label>
            <input
              {...register("userName", {
                required: messages.req,
              })}
              name="userName"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.userName ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "2rem" }}
            />
          </div>

          <div className="relative flex items-center">
            <HiOutlineMail className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="mail">Correo electrónico</label>
            <input
              {...register("mail", {
                required: messages.req,
                pattern: { value: patterns.mail, message: messages.mail },
              })}
              name="mail"
              type="email"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.mail ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "0.5rem" }}
            />
          </div>
          {errors.mail && <p className="text-red-500">{errors.mail.message}</p>}

          <div className="relative flex items-center">
            <HiMiniCake className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="birthdate">Fecha de nacimiento</label>
            <input
              {...register("birthdate", {
                required: messages.req,
              })}
              name="birthdate"
              type="date"
              className="w-full px-4 py-3 border rounded-lg g-white text-black"
            />
          </div>

          <div className="relative flex items-center">
            <HiMiniIdentification className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="gender">Género</label>
            <select
              {...register("gender")}
              name="gender"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.gender ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "3rem" }}
            >
              <option value="">Seleccionar...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">No binario</option>
              <option value="otro">Género fluido</option>
            </select>
          </div>
          {errors.gender && (
            <p className="text-red-500">{errors.gender.message}</p>
          )}

          <div className="relative flex items-center">
            <HiPhone className="w-6 h-6 text-radixgreen mr-3" />
            <label htmlFor="phone">Número de telefono</label>
            <input
              {...register("phone", {
                required: messages.req,
                pattern: {
                  value: patterns.phoneNumber,
                  message: messages.phone,
                },
              })}
              name="phone"
              type="number"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.phone ? "border-red-500" : "border-radixgreen"
              } bg-white text-black`}
              style={{ marginLeft: "0rem" }}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
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
