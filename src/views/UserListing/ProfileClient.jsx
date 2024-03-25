import React, { useState, useContext, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

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
                        <img className="w-80 h-80" src="https://i.imgur.com/Y23W1X9.png" />
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
                    <div>
                        <p className="text-radixgreen text-3xl font-bold mt-5 mb-2">Información del Usuario</p>
                        <hr className="border-radixgreen"/>
                    </div>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-5">Nombre: <span className="text-black/60">{userProfile ? userProfile.name+" "+userProfile.lastName : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Fecha de Nacimiento: <span className="text-black/60">{userProfile ? userProfile.birth : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Mail: <span className="text-black/60">{userProfile ? userProfile.email : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Número de Teléfono: <span className="text-black/60">{userProfile ? userProfile.phoneNumber : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Dirección: <span className="text-black/60">{userProfile ? userProfile.address : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Población: <span className="text-black/60">{userProfile ? userProfile.city : "Cargando..."}</span></p>
                    <div>
                        <p className={userProfile && userProfile.register ? "bg-amber-500/80 border border-radixgreen rounded-3xl text-white text-xl font-bold mt-5 p-3" + " text-center" : "bg-red-500/80 border border-radixgreen rounded-3xl text-white text-xl font-bold mt-5 p-3" + " text-center"}>
                            Estado de Matrícula: {userProfile ? userProfile.register ? "Activa" : "Caducada" : "Cargando..."}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileClient;
