import React, { useState, useContext, useEffect } from "react";
import { Button, Callout, Heading, Separator } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";

const ProfileClient = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [isCodeShown, setIsCodeShown] = useState(false);

  useEffect(() => {
    if (user) {
      getFromApi("clients/detail/" + user.username + "/")
        .then((response) => response.json())
        .then((data) => setUserProfile(data));
    }
  }, [user]);

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-4 md:mt-4 md:mb-4">
        <div className="flex justify-center md:m-0 m-5 items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 md:px-5 pt-8 flex-col">
          <div>
            <img className="w-80 h-80" src="https://i.imgur.com/Y23W1X9.png" alt="Profile" />
          </div>
          <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">{userProfile ? userProfile.user : "Cargando..."}</p>
          <Button className="bg-radixgreen/60 text-white" onClick={() => setIsCodeShown(!isCodeShown)}>
            {isCodeShown ? 'Ocultar Código de Usuario' : 'Mostrar Código de Usuario'}
          </Button>
          {isCodeShown && (
            <p className="text-radixgreen text-lg font-bold mt-5">{userProfile ? userProfile.zipCode : "Cargando..."}</p>
          )}
        </div>
        <div className="flex justify-center items-left flex-col md:pl-12 md:m-0 m-5">
          <FormContainer>
            <div>
              <Heading as="h1" color="green">
                Información del Usuario
              </Heading>
              <Separator size="4" color="green" />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <UserInfoRow label="Nombre" value={userProfile ? userProfile.name : "Cargando..."} />
              <UserInfoRow label="Apellidos" value={userProfile ? userProfile.lastName : "Cargando..."} />
              <UserInfoRow label="Fecha de Nacimiento" value={userProfile ? userProfile.birth : "Cargando..."} />
              <UserInfoRow label="Mail" value={userProfile ? userProfile.email : "Cargando..."} />
              <UserInfoRow label="Número de Teléfono" value={userProfile ? userProfile.phoneNumber : "Cargando..."} />
              <UserInfoRow label="Dirección" value={userProfile ? userProfile.address : "Cargando..."} />
              <UserInfoRow label="Población" value={userProfile ? userProfile.city : "Cargando..."} />
            </div>
            <div>
              <Callout.Root color={`${userProfile?.register ? "green" : "red"}`}>
                <Callout.Text>
                  Estado de Matrícula: {userProfile ? userProfile.register ? "Activa" : "Caducada" : "Cargando..."}
                </Callout.Text>
              </Callout.Root>
            </div>
          </FormContainer>
        </div>
      </div>
    </>
  );
};

const UserInfoRow = ({ label, value }) => (
  <div className="flex flex-col mb-3">
    <span className="text-radixgreen font-bold mb-1">{label}:</span>
    <span className="text-black">{value}</span>
  </div>
);

export default ProfileClient;
