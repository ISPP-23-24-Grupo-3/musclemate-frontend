import { useState, useEffect } from "react";
import { HiUser, HiLockClosed, HiOutlineMail, HiPhone } from "react-icons/hi";
import {
  HiBuildingOffice2,
  HiHome,
  HiMiniCake,
  HiMiniIdentification,
} from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button, Select, TextField, TextFieldSlot } from "@radix-ui/themes";
import { getFromApi, postToApi } from "../../utils/functions/api";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Form";
import { GymSelect } from "../../components/Gyms";
import { RHFSelect } from "../../components/RHFSelect";

const UserRegister = () => {
  const [gyms, setGyms] = useState(null);
  const navigate = useNavigate();
  const [errorMessageUser, setErrorMessageUser] = useState("Este nombre de usuario ya está en uso, prueba con otro");
  const [errorMessageMail, setErrorMessageMail] = useState("Ya existe un usuario con este email");

  async function getGyms() {
    const responseGym = await getFromApi("gyms/");
    const gymsData = await responseGym.json();
    return gymsData;
  }

  useEffect(() => {
    getGyms()
      .then((gyms) => setGyms(gyms))
      .catch((error) => console.log(error));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const {
        name,
        lastName,
        email,
        birth,
        gender,
        phoneNumber,
        address,
        city,
        zipCode,
        username,
        password,
        gym,
      } = formData;

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
          password,
        },
        gym,
      };

      const response = await postToApi("clients/create/", requestBody);

      if (!response.ok) {
        const responseData = await response.json();
        setErrorMessageUser(
          responseData.username ? responseData.username[0] : "",
        );
        setErrorMessageMail(responseData.email ? responseData.email[0] : "");
        return;
      }
      setErrorMessageUser(null);
      setErrorMessageMail(null);
      navigate("/owner/users");
    } catch (error) {
      console.error("Hubo un error al crear el usuario:", error);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de usuario tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
    phoneNumber: "Tiene que ser un número de 9 cifras",
    zipCode: "Tiene que ser un númeroo de 5 cifras",
  };

  const patterns = {
    mail: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    phoneNumber: /^\d{9}$/,
    zipCode: /^\d{5}$/,
  };

  return (
    <div className="flex justify-center items-center">
      <FormContainer>
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          Registro de nuevo usuario
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label htmlFor="name">Nombre</label>
            <TextField.Root>
              <TextField.Slot>
                <HiUser className="size-6 text-radixgreen" />
              </TextField.Slot>
              <TextField.Input
                {...register("name", {
                  required: messages.req,
                  maxLength: {
                    value: 100,
                    message: "El nombre no puede superar los 100 caracteres",
                  },
                })}
                name="name"
                type="text"
              />
            </TextField.Root>
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName">Apellidos</label>
            <TextField.Root
              {...register("lastName", {
                required: messages.req,
                maxLength: {
                  value: 100,
                  message: "Los apellidos no puede superar los 100 caracteres",
                },
              })}
            >
              <TextField.Slot>
                <HiUser className="size-6 text-radixgreen" />
              </TextField.Slot>
              <TextField.Input name="lastName" type="text" />
            </TextField.Root>
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">Correo electrónico</label>
            <TextField.Root>
              <TextField.Slot>
                <HiOutlineMail className="size-6 text-radixgreen" />
              </TextField.Slot>
              <TextField.Input
                {...register("email", {
                  required: messages.req,
                  pattern: { value: patterns.mail, message: messages.mail },
                })}
                name="email"
                type="email"
              />
            </TextField.Root>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
            {errorMessageMail && (
              <p className="text-red-500 mt-1 ml-3">{errorMessageMail}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="birth">Fecha de nacimiento</label>
            <TextField.Root>
              <TextFieldSlot>
                <HiMiniCake className="size-6 text-radixgreen" />
              </TextFieldSlot>
              <TextField.Input
                {...register("birth", {
                  required: messages.req,
                })}
                name="birth"
                type="date"
              />
            </TextField.Root>
            {errors.birth && (
              <p className="text-red-500">{errors.birth.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender">Género</label>
            <RHFSelect
              placeholder="Seleccionar..."
              {...register("gender", { required: messages.req })}
            >
              <Select.Item value="M">Masculino</Select.Item>
              <Select.Item value="F">Femenino</Select.Item>
              <Select.Item value="O">Otro</Select.Item>
            </RHFSelect>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phoneNumber">Número de telefono</label>
            <TextField.Root>
              <TextField.Slot>
                <HiPhone className="size-6 text-radixgreen" />
              </TextField.Slot>
              <TextField.Input
                {...register("phoneNumber", {
                  required: messages.req,
                  pattern: {
                    value: patterns.phoneNumber,
                    message: messages.phoneNumber,
                  },
                })}
                name="phoneNumber"
              />
            </TextField.Root>
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="address">Dirección</label>
            <TextField.Root>
              <TextField.Slot>
                <HiHome className="size-6 text-radixgreen" />
              </TextField.Slot>
              <TextField.Input
                {...register("address", {
                  required: messages.req,
                  maxLength: {
                    value: 255,
                    message: "La direción no puede superar los 255 caracteres",
                  },
                })}
                name="address"
              />
            </TextField.Root>
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="city">Ciudad</label>
            <TextField.Root>
              <TextField.Slot>
                <HiBuildingOffice2 className="size-6 text-radixgreen mr-3" />
              </TextField.Slot>
              <TextField.Input
                {...register("city", {
                  required: messages.req,
                  maxLength: {
                    value: 100,
                    message: "La ciudad no puede superar los 100 caracteres",
                  },
                })}
                name="city"
                type="text"
              />
            </TextField.Root>
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="zipCode">Código Postal</label>
            <TextField.Root>
              <TextField.Slot>
                <HiBuildingOffice2 className="size-6 text-radixgreen mr-3" />
              </TextField.Slot>
              <TextField.Input
                {...register("zipCode", {
                  required: messages.req,
                  pattern: {
                    value: patterns.zipCode,
                    message: messages.zipCode,
                  },
                })}
                name="zipCode"
                type="text"
              />
            </TextField.Root>
            {errors.zipCode && (
              <p className="text-red-500">{errors.zipCode.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="username" className="mr-3">
              Nombre de usuario
            </label>
            <TextField.Root>
              <TextField.Slot>
                <HiHome className="size-6 text-radixgreen mr-3" />
              </TextField.Slot>
              <TextField.Input
                {...register("username", {
                  required: messages.req,
                  maxLength: {
                    value: 150,
                    message:
                      "El nombre de usuario no puede superar los 150 caracteres",
                  },
                })}
                name="username"
                type="text"
              />
            </TextField.Root>
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
            {errorMessageUser && (
              <p className="text-red-500 mt-1 ml-3">{errorMessageUser}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mr-3">
              Contraseña
            </label>
            <TextField.Root>
              <TextField.Slot>
                <HiLockClosed className="w-6 h-6 text-radixgreen mr-3" />
              </TextField.Slot>
              <TextField.Input
                {...register("password", {
                  required: messages.req,
                  minLength: {
                    value: 10,
                    message: "La contraseña debe tener más de 10 caracteres",
                  },
                  maxLength: {
                    value: 128,
                    message:
                      "La contraseña no puede superar los 128 caracteres",
                  },
                })}
                name="password"
                type="password"
              />
            </TextField.Root>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="gym" className="mr-3">
              Gimnasio
            </label>
            <GymSelect {...register("gym", { required: messages.req })} />
            {errors.gym && <p className="text-red-500">{errors.gym.message}</p>}
          </div>

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
      </FormContainer>
    </div>
  );
};

export default UserRegister;
