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

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [isCodeShown, setIsCodeShown] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

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
      const response = await putToApi(`clients/update/${userId}/`, editedUser);
      if (response.ok) {
        setUser(editedUser);
        setEditMode(false);
      } else {
        console.error("Error updating user:", response.status);
      }
    } catch (error) {
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
                    type="text"
                    value={editedUser ? editedUser.name : ""}
                    onChange={(e) => handleInputChange(e, "name")}
                    placeholder="Nombre"
                  />
                  <label
                    htmlFor="lastName"
                    className="text-radixgreen font-bold"
                  >
                    Apellidos:
                  </label>
                  <TextField.Input
                    type="text"
                    value={editedUser ? editedUser.lastName : ""}
                    onChange={(e) => handleInputChange(e, "lastName")}
                    placeholder="Apellido"
                  />
                </>
              ) : (
                <span>
                  {user ? user.name + " " + user.lastName : "Cargando..."}
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
                  value={editedUser ? editedUser.phoneNumber : ""}
                  onChange={(e) => handleInputChange(e, "phoneNumber")}
                />
              ) : (
                <span>{user ? user.phoneNumber : "Cargando..."}</span>
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
