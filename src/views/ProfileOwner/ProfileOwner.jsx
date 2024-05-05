import React, { useState, useContext, useEffect } from "react";
import { Button, Heading, Separator, TextField } from "@radix-ui/themes";
import { getFromApi, putToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { RemoveAccount } from "../../components/RemoveAccount";
import { useForm, Controller } from "react-hook-form";

const ProfileOwner = () => {
  const { user } = useContext(AuthContext);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { handleSubmit, control, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      getFromApi("owners/detail/" + user.username + "/")
        .then((response) => response.json())
        .then((data) => {
          setOwnerProfile(data);
          reset(data);
        });
    }
  }, [user, reset]);

  const handleInputChange = (e, field) => {
    setEditedOwner({
      ...editedOwner,
      [field]: e,
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
      const response = await putToApi(
        `owners/update/${user.username}/`,
        formData
      );
      if (response.ok) {
        setOwnerProfile(formData);
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
            <img
              className="w-80 h-80"
              src="https://i.imgur.com/Y23W1X9.png"
              alt="Profile"
            />
          </div>
          <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">
            {ownerProfile ? ownerProfile.user : "Cargando..."}
          </p>
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
                type="text"
                label="Nombre"
                value={ownerProfile ? ownerProfile.name : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "name")}
              />
              <UserInfoInput
                type="text"
                label="Apellidos"
                value={ownerProfile ? ownerProfile.last_name : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
              <UserInfoInput
                type="text"
                label="Correo Electrónico"
                value={ownerProfile ? ownerProfile.email : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "email")}
              />
              <UserInfoInput
                type="number"
                label="Número de Teléfono"
                value={ownerProfile ? ownerProfile.phone_number : "Cargando..."}
                editMode={editMode}
                onChange={(e) => handleInputChange(e, "phoneNumber")}
              />
              <UserInfoInput
                type="text"
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
                    <Button variant="surface" onClick={toggleEditMode}>
                      Cancelar
                    </Button>

                  </div>
                ) : (
                  <Button onClick={() => setEditMode(true)}>Editar</Button>
                )}
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
      <RemoveAccount />
    </>
  );
};

const UserInfoInput = ({ type, label, value, editMode, onChange }) => (
  <div className="flex flex-col mb-3">
    <span className="text-radixgreen font-bold mt-5">{label}:</span>
    {editMode ? (
      <TextField.Root>
        <TextField.Input
          type={type}
          className="text-black"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
      </TextField.Root>
    ) : (
      <span className="text-black">{value}</span>
    )}
  </div>
);

export default ProfileOwner;
