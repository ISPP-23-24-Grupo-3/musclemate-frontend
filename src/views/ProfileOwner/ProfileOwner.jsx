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

  const handleSaveChanges = async (formData) => {
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
            <form onSubmit={handleSubmit(handleSaveChanges)}>
              <div className="grid grid-cols-2 gap-x-4">
                <UserInfoInput
                  label="Nombre"
                  name="name"
                  control={control}
                  defaultValue=""
                  disabled={!editMode}
                  rules={{ required: "Este campo es obligatorio" }}
                  error={errors.name}
                />
                <UserInfoInput
                  label="Apellidos"
                  name="last_name"
                  control={control}
                  defaultValue=""
                  disabled={!editMode}
                  rules={{ required: "Este campo es obligatorio" }}
                  error={errors.lastName}
                />
                <UserInfoInput
                  label="Correo Electrónico"
                  name="email"
                  control={control}
                  defaultValue=""
                  disabled={!editMode}
                  rules={{ 
                    required: "Este campo es obligatorio", 
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Correo electrónico inválido"
                    }
                  }}
                  error={errors.email}
                />
                <UserInfoInput
                  label="Número de Teléfono"
                  name="phone_number"
                  control={control}
                  defaultValue=""
                  disabled={!editMode}
                  rules={{ 
                    required: "Este campo es obligatorio", 
                    pattern: { 
                      value: /^[0-9]+$/, 
                      message: "Ingrese solo números"
                    }, 
                    minLength: { value: 10, message: "Mínimo 10 números" }, 
                    maxLength: { value: 12, message: "Máximo 12 números" } 
                  }}
                  error={errors.phoneNumber}
                />
                <UserInfoInput
                  label="Dirección"
                  name="address"
                  control={control}
                  defaultValue=""
                  disabled={!editMode}
                  rules={{ required: "Este campo es obligatorio" }}
                  error={errors.address}
                />
              </div>
              <div className="mt-4 text-center">
                {editMode ? (
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <Button type="submit">Guardar</Button>
                      <Button
                        type="button"
                        variant="surface"
                        onClick={() => setEditMode(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
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

const UserInfoInput = ({ label, name, control, defaultValue, disabled, rules, error }) => (
  <div className="flex flex-col mb-3">
    <span className="text-radixgreen font-bold mt-5">{label}:</span>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <>
          <TextField.Input
            type="text"
            className="text-black"
            {...field}
            disabled={disabled}
            placeholder={label}
          />
          {error && <span className="text-red-500">{error.message}</span>}
        </>
      )}
    />
  </div>
);

export default ProfileOwner;
