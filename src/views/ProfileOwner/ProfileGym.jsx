import { useState, useContext, useEffect } from "react";
import { Heading, Separator, TextField } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { FormContainer } from "../../components/Form";
import { RemoveAccount } from "../../components/RemoveAccount";

const ProfileGym = () => {
  const { user } = useContext(AuthContext);
  const [gymProfile, setgymProfile] = useState(null);

  useEffect(() => {
    if (user) {
      getFromApi("gyms/detail/" + user.username + "/")
        .then((response) => response.json())
        .then((data) => setgymProfile(data));
    }
  }, [user]);

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-4 md:mt-4 md:mb-4">
        <div className="flex justify-center md:m-0 m-5 items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 md:px-5 pt-8 flex-col">
          <div>
            <img
              className="w-80 h-80"
              src="https://i.pinimg.com/originals/1c/03/26/1c0326e1f7aa89855ab1677bd023f0ff.png"
              alt="Profile"
            />
          </div>
        </div>
        <div className="flex justify-center items-left flex-col md:pl-12 md:m-0 m-5">
          <FormContainer>
            <div>
              <Heading as="h1" color="green">
                Información del Gimnasio
              </Heading>
              <Separator size="4" color="green" />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <UserInfoInput
                label="Nombre"
                value={gymProfile ? gymProfile.name : "Cargando..."}
              />
              <UserInfoInput
                label="Dirección"
                value={gymProfile ? gymProfile.address : "Cargando..."}
              />
              <UserInfoInput
                label="Código ZIP"
                value={gymProfile ? gymProfile.zip_code : "Cargando..."}
              />
              <UserInfoInput
                label="Correo Electrónico"
                value={gymProfile ? gymProfile.email : "Cargando..."}
              />
              <UserInfoInput
                label="Número de Teléfono"
                value={gymProfile ? gymProfile.phone_number : "Cargando..."}
              />
              <UserInfoInput
                label="Plan de Subscripción"
                value={
                  gymProfile ? gymProfile.subscription_plan : "Cargando..."
                }
              />
            </div>
          </FormContainer>
        </div>
      </div>
      <RemoveAccount />
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

export default ProfileGym;
