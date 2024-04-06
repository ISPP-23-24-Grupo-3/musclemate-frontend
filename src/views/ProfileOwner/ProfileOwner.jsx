import React, { useState, useContext, useEffect } from "react";
import { Button, Heading, Separator, TextField } from "@radix-ui/themes";
import { getFromApi, putToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";

const ProfileOwner = () => {
  const { user } = useContext(AuthContext);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedOwner, setEditedOwner] = useState(null);

  useEffect(() => {
    if (user) {
      getFromApi("owners/detail/" + user.username + "/")
        .then((response) => response.json())
        .then((data) => setOwnerProfile(data));
    }
  }, [user]);

  const handleInputChange = (e, field) => {
    setEditedOwner({
      ...editedOwner,
      [field]: e.target.value
    });
  };

  const toggleEditMode = () => {
    if (!editMode) {
      setEditedOwner(ownerProfile);
    }
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await putToApi(`owners/update/${user.username}/`, editedOwner);
      if (response.ok) {
        setOwnerProfile(editedOwner);
        setEditMode(false);
      } else {
        console.error("Error updating owner:", response.status);
      }
    } catch (error) {
      console.error("Error updating owner:", error);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-4 md:mt-4 md:mb-4">
        <div className="flex justify-center md:m-0 m-5 items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 md:px-5 pt-8 flex-col">
          <div>
            <img className="w-80 h-80" src="https://i.imgur.com/Y23W1X9.png" alt="Profile" />
          </div>
          <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">{ownerProfile ? ownerProfile.user : "Cargando..."}</p>
        </div>
        <div className="flex justify-center items-left flex-col md:pl-12 md:m-0 m-5">
          <FormContainer>
            <div>
              <Heading as="h1" color="green">
                Información del Propietario
              </Heading>
              <Separator size="4" color="green" />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <UserInfoInput
                label="Nombre"
                value={ownerProfile ? ownerProfile.name : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "name")}
              />
              <UserInfoInput
                label="Apellidos"
                value={ownerProfile ? ownerProfile.lastName : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
              <UserInfoInput
                label="Correo Electrónico"
                value={ownerProfile ? ownerProfile.email : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "email")}
              />
              <UserInfoInput
                label="Número de Teléfono"
                value={ownerProfile ? ownerProfile.phoneNumber : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "phoneNumber")}
              />
              <UserInfoInput
                label="Dirección"
                value={ownerProfile ? ownerProfile.address : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "address")}
              />
            </div>
            <div className="mt-4 text-center">
              {editMode ? (
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Button onClick={handleSaveChanges}>Guardar</Button>
                    <Button variant="surface" onClick={toggleEditMode}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={toggleEditMode}>Editar</Button>
              )}
            </div>
          </FormContainer>
        </div>
      </div>
    </>
  );
};

const UserInfoInput = ({ label, value, editMode, onChange }) => (
  <div className="flex flex-col mb-3">
    <span className="text-radixgreen font-bold mt-5">{label}:</span>
    {editMode ? (
      <TextField.Input
        type="text"
        className="text-black"
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    ) : (
      <span className="text-black">{value}</span>
    )}
  </div>
);

export default ProfileOwner;
