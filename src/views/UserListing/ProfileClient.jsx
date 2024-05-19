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
  const [clientId, setClientId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profileResponse = await getFromApi("clients/detail/" + user.username + "/");
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUserProfile(profileData);
            setClientId(profileData.id);
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

  const validateInputs = () => {
    const newErrors = {};
    const patterns = {
      mail: /\S+@\S+\.\S+/,
      phoneNumber: /^\d{9}$/,
      zipCode: /^\d{5}$/,
      noNumbers: /^[^0-9]*$/,
    };
    const messages = {
      req: "Este campo es obligatorio",
      mail: "Debes introducir una dirección de correo electrónico correcta",
      phoneNumber: "Tiene que ser un número de 9 cifras",
      zipCode: "Tiene que ser un número de 5 cifras",
      noNumbers: "Este campo no puede contener números",
    };

    if (!editedUserProfile.name) {
      newErrors.name = messages.req;
    } else if (editedUserProfile.name.length > 100) {
      newErrors.name = "El nombre no puede superar los 100 caracteres";
    } else if (!patterns.noNumbers.test(editedUserProfile.name)) {
      newErrors.name = messages.noNumbers;
    }

    if (!editedUserProfile.last_name) {
      newErrors.last_name = messages.req;
    } else if (editedUserProfile.last_name.length > 100) {
      newErrors.last_name = "Los apellidos no pueden superar los 100 caracteres";
    } else if (!patterns.noNumbers.test(editedUserProfile.last_name)) {
      newErrors.last_name = messages.noNumbers;
    }

    if (!editedUserProfile.email) {
      newErrors.email = messages.req;
    } else if (!patterns.mail.test(editedUserProfile.email)) {
      newErrors.email = messages.mail;
    }

    if (!editedUserProfile.phone_number) {
      newErrors.phone_number = messages.req;
    } else if (!patterns.phoneNumber.test(editedUserProfile.phone_number)) {
      newErrors.phone_number = messages.phoneNumber;
    }

    if (!editedUserProfile.address) {
      newErrors.address = messages.req;
    } else if (editedUserProfile.address.length > 255) {
      newErrors.address = "La dirección no puede superar los 255 caracteres";
    }

    if (!editedUserProfile.city) {
      newErrors.city = messages.req;
    } else if (editedUserProfile.city.length > 100) {
      newErrors.city = "La ciudad no puede superar los 100 caracteres";
    }

    if (!editedUserProfile.zipCode) {
      newErrors.zipCode = messages.req;
    } else if (!patterns.zipCode.test(editedUserProfile.zipCode)) {
      newErrors.zipCode = messages.zipCode;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await putToApi(`clients/update/${clientId}/`, editedUserProfile);
      if (response.ok) {
        setUserProfile(editedUserProfile);
        setEditMode(false);
        setErrors({});
      } else {
        const errorData = await response.json();
        if (errorData.email) {
          setErrors({ email: "Ya existe un usuario con este email" });
        } else {
          console.error("Error updating user:", response.status);
        }
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
                error={errors.name}
              />
              <UserInfoRow
                label="Apellidos"
                value={userProfile ? userProfile.last_name : "Cargando..."}
                editMode={editMode}
                field="last_name"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.last_name : ""}
                error={errors.last_name}
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
                error={errors.email}
              />
              <UserInfoRow
                label="Número de Teléfono"
                value={userProfile ? userProfile.phone_number : "Cargando..."}
                editMode={editMode}
                field="phone_number"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.phone_number : ""}
                error={errors.phone_number}
              />
              <UserInfoRow
                label="Dirección"
                value={userProfile ? userProfile.address : "Cargando..."}
                editMode={editMode}
                field="address"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.address : ""}
                error={errors.address}
              />
              <UserInfoRow
                label="Población"
                value={userProfile ? userProfile.city : "Cargando..."}
                editMode={editMode}
                field="city"
                onChange={handleInputChange}
                editedValue={editedUserProfile ? editedUserProfile.city : ""}
                error={errors.city}
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

const UserInfoRow = ({ label, value, editMode, field, onChange, editedValue, error, readOnly }) => (
  <div className="flex flex-col mb-3">
    <span className="text-radixgreen font-bold mb-1">{label}:</span>
    {editMode && !readOnly ? (
      <>
        <TextField.Input
          type="text"
          value={editedValue}
          onChange={(e) => onChange(e, field)}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </>
    ) : (
      <span className="text-black">{value}</span>
    )}
  </div>
);

export default ProfileClient;
