import { useState, useEffect } from "react";
import { HiUser, HiLockClosed, HiOutlineMail, HiPhone } from "react-icons/hi";
import { HiHome } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@radix-ui/themes";
import { postToApiRegister } from "../../utils/functions/api";
import { useNavigate, Link } from "react-router-dom";
import { FormContainer } from "../../components/Form";
import { ClipLoader } from "react-spinners";

const RegisterClient = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onBlur" });

  console.log(errors);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const {
        name,
        lastName,
        email,
        phoneNumber,
        address,
        username,
        password,
      } = formData;

      const requestBody = {
        name,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        address,
        userCustom: {
          username,
          password,
        },
      };

      const response = await postToApiRegister("owners/create/", requestBody);
      const data = await response.json();
      if (response.ok) {
        setError(null);
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Espera 2 segundos antes de redirigir
      } else {
        if (data.username) {
          setError("Este nombre de usuario ya existe, prueba con otro");
        } else if (data.email) {
          setError("Ya existe un usuario con este email");
        } else {
          setError("Hubo un error al crear el propietario");
        }
        console.error("Hubo un error al crear el propietario:", data);
      }
    } catch (error) {
      setError("Hubo un error al crear el propietario");
      console.error("Hubo un error al crear el propietario:", error);
    } finally {
      setLoading(false);
    }
  };

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre del gimnasio tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    username: "Este nombre de usuario ya existe, prueba con otro",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
    confirmPass: "Las contraseñas no coinciden",
  };

  useEffect(() => {
    let redirectTimer;
    if (success) {
      redirectTimer = setTimeout(() => {
        navigate("/login");
      }, 2000); // Espera 2 segundos antes de redirigir
    }
    return () => clearTimeout(redirectTimer);
  }, [success, navigate]);

  const watchPassword = watch("password", "");

  return (
    <FormContainer className="">
      <h2 className="mb-3 text-radixgreen font-bold text-4xl text-center">
        Registro de nuevo propietario
      </h2>
      {success && (
        <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
          Registro completado
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="name" className="mr-3">
            Nombre
          </label>
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
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastname" className="mr-3">
            Apellidos
          </label>
          <TextField.Root>
            <TextField.Slot>
              <HiUser className="size-6 text-radixgreen" />
            </TextField.Slot>
            <TextField.Input
              {...register("lastName", {
                required: messages.req,
                maxLength: {
                  value: 100,
                  message: "Los apellidos no puede superar los 100 caracteres",
                },
              })}
              name="lastName"
              type="text"
            />
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
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
                  message:
                    "Debes introducir una dirección de correo electrónico válida",
                },
              })}
              name="email"
              type="email"
            />
          </TextField.Root>
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className="mr-3">
            Número de telefono
          </label>
          <TextField.Root>
            <TextField.Slot>
              <HiPhone className="size-6 text-radixgreen mr-3" />
            </TextField.Slot>
            <TextField.Input
              {...register("phoneNumber", {
                required: messages.req,
                pattern: {
                  value: /^\d{9}$/,
                  message: "El número de teléfono debe tener 9 dígitos",
                },
              })}
              name="phoneNumber"
              type="tel"
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
              type="text"
            />
          </TextField.Root>
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="username">Nombre de usuario</label>
          <TextField.Root>
            <TextField.Slot>
              <HiHome className="size-6 text-radixgreen" />
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
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">Contraseña</label>
          <TextField.Root>
            <TextField.Slot>
              <HiLockClosed className="size-6 text-radixgreen" />
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
                  message: "La contraseña no puede superar los 128 caracteres",
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
          <label htmlFor="passwordConfirmation" className="mr-3">
            Confirmar contraseña
          </label>
          <TextField.Root>
            <TextField.Slot>
              <HiLockClosed className="size-6 text-radixgreen" />
            </TextField.Slot>
            <TextField.Input
              {...register("passwordConfirmation", {
                required: messages.req,
                validate: (value) =>
                  value === watchPassword || messages.confirmPass,
              })}
              name="passwordConfirmation"
              type="password"
            />
          </TextField.Root>
          {errors.passwordConfirmation && (
            <p className="text-red-500">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="checkbox"
            {...register("terms", {
              required: {
                value: true,
                message: "Tienes que aceptar los Términos y Condiciones",
              },
            })}
          />
          <label htmlFor="terms" className="mr-3">
            Acepto los{" "}
            <Link className="text-blue-500" to="/terms-conditions">
              Términos y Condiciones
            </Link>
          </label>
          {errors.terms && (
            <p className="text-red-500">{errors.terms.message}</p>
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <Button
          type="submit"
          size="3"
          variant="solid"
          color="green"
          className="w-full py-3"
          disabled={!isValid}
        >
          {loading ? <ClipLoader color="#ffffff" /> : "Registrarse"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default RegisterClient;
