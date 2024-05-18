import React, { useState, useContext, useEffect } from "react";
import { Button, Callout, Heading, Separator, TextField } from "@radix-ui/themes";
import { getFromApi, putToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { RemoveAccount } from "../../components/RemoveAccount";

const ProfileClient = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [editedUserProfile, setEditedUserProfile] = useState(null);
  const [isCodeShown, setIsCodeShown] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [clientId, setClientId] = useState(null); // Estado para guardar el ID del cliente

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profileResponse = await getFromApi("clients/detail/" + user.username + "/");
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUserProfile(profileData);
            setClientId(profileData.id); // Guardar el ID del cliente
          } else {
            console.error("Error fetching user profile:", profileResponse.status);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e, field) => {
    setEditedUserProfile({
      ...editedUserProfile,
      [field]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setEditedUserProfile(userProfile);
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await putToApi(`clients/update/${clientId}/`, editedUserProfile);
      if (response.ok) {
        setUserProfile(editedUserProfile);
        setEditMode(false);
      } else {
        console.error("Error updating user:", response.status);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-4 md:mt-4 md:mb-4">
        <div className="flex justify-center md:m-0 m-5 items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 md:px-5 pt-8 flex-col">
          <div>
            <img
              className="w-80 h-80"
              src="https://i.imgur.com/Y23W1X9.png"
              alt="Profile"
            />
          </div>
          <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">
            {userProfile ? userProfile.user : "Cargando..."}
          </p>
          <Button
            className="bg-radixgreen/60 text-white"
            onClick={() => setIsCodeShown(!isCodeShown)}
          >
            {isCodeShown ? "Ocultar Código de Usuario" : "Mostrar Código de Usuario"}
          </Button>
          {isCodeShown && (
            <p className="text-radixgreen text-lg font-bold mt-5">
              {userProfile ? userProfile.zipCode : "Cargando..."}
            </p>
          )}
        </div>
        <div className="flex justify-center items-left flex-col md:pl-12 md:m-0 m-5">
          <FormContainer>
            <div>
              <Heading as="h1" color="green">Información del Usuario</Heading>
              <Separator size="4" color="green" />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <UserInfoRow
                label="Nombre"
                value={userProfile ? userProfile.name : "Cargando..."}
                editMode={editMode}
                field="name"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.name : ""}
              />
              <UserInfoRow
                label="Apellidos"
                value={userProfile ? userProfile.last_name : "Cargando..."}
                editMode={editMode}
                field="last_name"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.last_name : ""}
              />
              <UserInfoRow
                label="Fecha de Nacimiento"
                value={userProfile ? userProfile.birth : "Cargando..."}
                readOnly={true}
              />
              <UserInfoRow
                label="Mail"
                value={userProfile ? userProfile.email : "Cargando..."}
                editMode={editMode}
                field="email"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.email : ""}
              />
              <UserInfoRow
                label="Número de Teléfono"
                value={userProfile ? userProfile.phone_number : "Cargando..."}
                editMode={editMode}
                field="phone_number"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.phone_number : ""}
              />
              <UserInfoRow
                label="Dirección"
                value={userProfile ? userProfile.address : "Cargando..."}
                editMode={editMode}
                field="address"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.address : ""}
              />
              <UserInfoRow
                label="Población"
                value={userProfile ? userProfile.city : "Cargando..."}
                editMode={editMode}
                field="city"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.city : ""}
              />
            </div>
            <div className="mt-6">
              <Callout.Root color={`${userProfile?.register ? "green" : "red"}`}>
                <Callout.Text>
                  Estado de Matrícula:{" "}
                  {userProfile
                    ? userProfile.register
                      ? "Activa"
                      : "Caducada"
                    : "Cargando..."}
                </Callout.Text>
              </Callout.Root>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              {editMode ? (
                <div className="flex justify-between flex-wrap gap-3">
                  <Button onClick={handleSaveChanges}>Guardar</Button>
                  <Button variant="surface" onClick={toggleEditMode}>Cancelar</Button>
                </div>
              ) : (
                <Button onClick={toggleEditMode}>Editar</Button>
              )}
            </div>
          </FormContainer>
        </div>
      </div>
      <RemoveAccount />
    </>
  );
};

const UserInfoRow = ({ label, value, editMode, field, onChange, editedValue, readOnly }) => (
  <div className="flex flex-col mb-3">
    <span className="text-radixgreen font-bold mb-1">{label}:</span>
    {editMode && !readOnly ? (
      <TextField.Input
        type="text"
        value={editedValue}
        onChange={(e) => onChange(e, field)}
      />
    ) : (
      <span className="text-black">{value}</span>
    )}
  </div>
);

export default ProfileClient;
