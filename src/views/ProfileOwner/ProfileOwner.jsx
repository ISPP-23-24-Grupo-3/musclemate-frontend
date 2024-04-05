import React, { useState, useContext, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { getFromApi, putToApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";

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
                        <img className="w-80 h-80" src="https://i.imgur.com/Y23W1X9.png" />
                    </div>
                    <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">{ownerProfile ? ownerProfile.user : "Cargando..."}</p>
                </div>
                <div className="flex justify-center items-left flex-col md:pl-12 md:m-0 m-5">
                    <div>
                        <p className="text-radixgreen text-3xl font-bold mt-5 mb-2">Información del Propietario</p>
                        <hr className="border-radixgreen"/>
                    </div>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-5">Nombre: 
                        {editMode ? (
                            <input
                                type="text"
                                className="text-black"
                                value={editedOwner ? editedOwner.name : ""}
                                onChange={(e) => handleInputChange(e, "name")}
                                placeholder="Nombre"
                            />
                        ) : (
                            <span className="text-black/60">{ownerProfile ? ownerProfile.name : "Cargando..."}</span> 
                        )}
                    </p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Apellidos: 
                        {editMode ? (
                            <input
                                type="text"
                                className="text-black"
                                value={editedOwner ? editedOwner.lastName : ""}
                                onChange={(e) => handleInputChange(e, "lastName")}
                                placeholder="Apellido"
                            />
                        ) : (
                            <span className="text-black/60">{ownerProfile ? ownerProfile.lastName : "Cargando..."}</span>
                        )}
                    </p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Correo Electrónico: 
                        {editMode ? (
                            <input
                                type="email"
                                className="text-black"
                                value={editedOwner ? editedOwner.email : ""}
                                onChange={(e) => handleInputChange(e, "email")}
                            />
                        ) : (
                            <span className="text-black/60">{ownerProfile ? ownerProfile.email : "Cargando..."}</span>
                        )}
                    </p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Número de Teléfono: 
                        {editMode ? (
                            <input
                                type="text"
                                className="text-black"
                                value={editedOwner ? editedOwner.phoneNumber : ""}
                                onChange={(e) => handleInputChange(e, "phoneNumber")}
                            />
                        ) : (
                            <span className="text-black/60">{ownerProfile ? ownerProfile.phoneNumber : "Cargando..."}</span>
                        )}
                    </p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Dirección: 
                        {editMode ? (
                            <input
                                type="text"
                                className="text-black"
                                value={editedOwner ? editedOwner.address : ""}
                                onChange={(e) => handleInputChange(e, "address")}
                            />
                        ) : (
                            <span className="text-black/60">{ownerProfile ? ownerProfile.address : "Cargando..."}</span>
                        )}
                    </p>
                    <div className="mt-4 text-center">
                        {editMode ? (
                            <>
                                <Button onClick={handleSaveChanges}>Guardar</Button>
                                <Button onClick={toggleEditMode}>Cancelar</Button>
                            </>
                        ) : (
                            <Button onClick={toggleEditMode}>Editar</Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileOwner;
