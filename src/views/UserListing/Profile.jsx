import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Callout,
  Heading,
  Separator,
  Skeleton,
  TextField,
} from "@radix-ui/themes";
import { getFromApi, putToApi } from "../../utils/functions/api";
import { FormContainer } from "../../components/Form";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [isCodeShown, setIsCodeShown] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(userId);
    getFromApi("clients/detail/" + userId + "/")
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, [userId]);

  useEffect(() => {
    if (user) {
      getFromApi("gyms/detail/" + user.gym + "/")
        .then((response) => response.json())
        .then((data) => setGym(data));
    }
  }, [user]);

  const handleInputChange = (e, field) => {
    setEditedUser({
      ...editedUser,
      [field]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setEditedUser(user);
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
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
      } = editedUser;

      const birthDate = new Date(birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (birthDate > today) {
        setError(true)
        return;
      } 
      else if (age < 12) {
        setError(true)
        return;
      }
      else {
        setError(false)
        const response = await putToApi(`clients/update/${userId}/`, editedUser);
        if (response.ok) {
          setUser(editedUser);
          setEditMode(false);
        } else {
          setError(true)
          console.error("Error updating user:", response.status);
        }
      }
    } catch (error) {
      setError(true)
      console.error("Error updating user:", error);
    }
  };

  const handleToggleRegistration = async () => {
    const updatedUser = { ...user, register: !user.register };
    setUser(updatedUser); // Actualiza el estado local del usuario
    if (editMode) {
      setEditedUser(updatedUser); // Actualiza el objeto editedUser si estamos en modo de edición
    }
    try {
      const response = await putToApi(`clients/update/${userId}/`, updatedUser);
      if (response.ok) {
        // No necesitas actualizar el estado del usuario aquí, ya que ya lo has hecho arriba
        // setUser(prevUser => ({ ...prevUser, register: !prevUser.register }));
      } else {
        console.error("Error toggling registration:", response.status);
      }
    } catch (error) {
      console.error("Error toggling registration:", error);
    }
  };

  const{register,formState: { errors }} = useForm();

  const messages = {
    req: "Este campo es obligatorio",
    name: "El nombre de usuario tiene que ser mayor a 8 caracteres",
    mail: "Debes introducir una dirección correcta",
    password: "La contraseña tiene que ser mayor a 10 caracteres",
    phoneNumber: "Tiene que ser un número de 9 cifras",
    zipCode: "Tiene que ser un númeroo de 5 cifras",
    confirmPass: "Las contraseñas no coinciden",
  };

  const patterns = {
    mail: /\S+@\S+\.\S+/,
    phoneNumber: /^\d{9}$/,
    zipCode: /^\d{5}$/,
  };

  return (
    <>
      <div className="flex flex-wrap gap-10">
        <div className="flex-1 flex justify-center md:m-0 m-5 items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 md:px-5 pt-8 flex-col">
          <div>
            <img className="w-80 h-80" src="https://i.imgur.com/Y23W1X9.png" />
          </div>
          <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">
            {user ? user.user : "Cargando..."}
          </p>
          <p className="text-center text-black/60 text-2xl uppercase font-bold mb-4">
            {gym ? gym.name : "Cargando..."}
          </p>
          <Button
            className="bg-radixgreen/60 text-white"
            onClick={() => setIsCodeShown(!isCodeShown)}
          >
            {isCodeShown
              ? "Ocultar Código de Usuario"
              : "Mostrar Código de Usuario"}
          </Button>
          {isCodeShown && (
            <p className="text-radixgreen text-lg font-bold mt-5">
              {user ? user.zipCode : "Cargando..."}
            </p>
          )}
        </div>
        <FormContainer className="flex-1">
          <div className="flex flex-col gap-3">
            <div>
              <Heading as="h1" color="green">
                Información del Usuario
              </Heading>
              <Separator size="4" color="green" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-radixgreen font-bold">
                Nombre:
              </label>
              {editMode ? (
                <>
                  <TextField.Input
                  {...register("name", {
                    required: messages.req,
                    maxLength: {
                      value: 100,
                      message: "El nombre no puede superar los 100 caracteres",
                    },
                  })}
                    type="text"
                    name="name"
                    value={editedUser ? editedUser.name : ""}
                    onChange={(e) => handleInputChange(e, "name")}
                    placeholder="Nombre"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                  <label
                    htmlFor="lastName"
                    className="text-radixgreen font-bold"
                  >
                    Apellidos:
                  </label>
                  <TextField.Input
                    type="text"
                    value={editedUser ? editedUser.last_name : ""}
                    onChange={(e) => handleInputChange(e, "last_name")}
                    placeholder="Apellido"
                  />
                </>
              ) : (
                <span>
                  {user ? user.name + " " + user.last_name : "Cargando..."}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-radixgreen font-bold">
                Fecha de Nacimiento:
              </span>
              {editMode ? (
                <TextField.Input
                  type="date"
                  value={editedUser ? editedUser.birth : ""}
                  onChange={(e) => handleInputChange(e, "birth")}
                />
              ) : (
                <span>{user ? user.birth : "Cargando..."}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-radixgreen font-bold">Mail:</span>
              {editMode ? (
                <TextField.Input
                  type="email"
                  value={editedUser ? editedUser.email : ""}
                  onChange={(e) => handleInputChange(e, "email")}
                />
              ) : (
                <span>{user ? user.email : "Cargando..."}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-radixgreen font-bold">
                Número de Teléfono:
              </span>
              {editMode ? (
                <TextField.Input
                  value={editedUser ? editedUser.phone_number : ""}
                  onChange={(e) => handleInputChange(e, "phone_number")}
                />
              ) : (
                <span>{user ? user.phone_number : "Cargando..."}</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-radixgreen font-bold">Dirección:</span>
              {editMode ? (
                <TextField.Input
                  type="text"
                  value={editedUser ? editedUser.address : ""}
                  onChange={(e) => handleInputChange(e, "address")}
                />
              ) : (
                <span>{user ? user.address : "Cargando..."}</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-radixgreen font-bold">Población:</span>
              {editMode ? (
                <TextField.Input
                  type="text"
                  value={editedUser ? editedUser.city : ""}
                  onChange={(e) => handleInputChange(e, "city")}
                />
              ) : (
                <span>{user ? user.city : "Cargando..."}</span>
              )}
            </div>
            <div>
              <Callout.Root color={`${user?.register ? "green" : "red"}`}>
                <Callout.Text>
                  Matrícula{" "}
                  {user
                    ? user.register
                      ? "Activa"
                      : "Caducada"
                    : "Cargando..."}
                </Callout.Text>
              </Callout.Root>
            </div>
            {error && (
              <p className="text-red-500">Hubo un problema al actualizar el usuario por favor revise todos los campos</p>
            )}
            <div className="flex flex-col gap-3">
              {editMode ? (
                <div className="flex justify-between flex-wrap gap-3">
                  <div className="flex gap-3">
                    <Button onClick={handleSaveChanges}>Guardar</Button>
                    <Button variant="surface" onClick={toggleEditMode}>
                      Cancelar
                    </Button>
                  </div>
                  <Button
                    color="red"
                    variant="surface"
                    onClick={handleToggleRegistration}
                  >
                    {user && user.register
                      ? "Desactivar Matrícula"
                      : "Activar Matrícula"}
                  </Button>
                </div>
              ) : (
                <Button onClick={toggleEditMode}>Editar</Button>
              )}
            </div>
          </div>
        </FormContainer>
      </div>
    </>
  );
};

export default Profile;
