import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@radix-ui/themes";
import { getFromApi, putToApi } from "../../utils/functions/api";

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [gym, setGym] = useState(null);
    const [isCodeShown, setIsCodeShown] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    useEffect(() => {
        getFromApi("clients/detail/"+ userId + "/") 
            .then((response) => response.json())
            .then((data) => setUser(data));
    }, [userId]);

    useEffect(() => {
        if (user) {
            getFromApi("gyms/detail/"+ user.gym + "/") 
                .then((response) => response.json())
                .then((data) => setGym(data));
        }
    }, [user]);

    const handleInputChange = (e, field) => {
        setEditedUser({
            ...editedUser,
            [field]: e.target.value
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

    return (
        <>
            <div className="grid md:grid-cols-2 md:gap-4 md:mt-4 md:mb-4">
                <div className="flex justify-center md:m-0 m-5 items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 md:px-5 pt-8 flex-col">
                    <div>
                        <img className="w-80 h-80" src={user ? user.photo : "https://i.imgur.com/Y23W1X9.png"} onError={(e) => {e.target.onerror = null; e.target.src="https://i.imgur.com/Y23W1X9.png"}}/>
                    </div>
                    <p className="text-center text-radixgreen text-2xl font-bold mt-5 mb-3">{user ? user.user : "Cargando..."}</p>
                    <p className="text-center text-black/60 text-2xl uppercase font-bold mb-4">{gym ? gym.name : "Cargando..."}</p>
                    <Button className="bg-radixgreen/60 text-white" onClick={() => setIsCodeShown(!isCodeShown)}>
                        {isCodeShown ? 'Ocultar Código de Usuario' : 'Mostrar Código de Usuario'}
                    </Button>
                    {isCodeShown && (
                        <p className="text-radixgreen text-lg font-bold mt-5">{user ? user.zipCode : "Cargando..."}</p>
                    )}
                </div>
                <div className="flex justify-center items-left flex-col md:pl-12 md:m-0 m-5">
                    <div>
                        <p className="text-radixgreen text-3xl font-bold mt-5 mb-2">Información del Usuario</p>
                        <hr className="border-radixgreen"/>
                    </div>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-5">Nombre: 
                    {editMode ? (
                        <>
                            <input
                                type="text"
                                value={editedUser ? editedUser.name : ""}
                                onChange={(e) => handleInputChange(e, "name")}
                                placeholder="Nombre"
                            />
                            <input
                                type="text"
                                value={editedUser ? editedUser.lastName : ""}
                                onChange={(e) => handleInputChange(e, "lastName")}
                                placeholder="Apellido"
                            />
                        </>
                        ) : (
                            <span className="text-black/60">{user ? user.name+" "+user.lastName : "Cargando..."}</span>
                        )}
                    </p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Fecha de Nacimiento: 
                        <span className="text-black/60">{user ? user.birth : "Cargando..."}</span>
                    </p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Mail: 
                        <span className="text-black/60">{user ? user.email : "Cargando..."}</span>
                    </p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Número de Teléfono: 
                        {editMode ? (
                            <input
                                type="text"
                                value={editedUser ? editedUser.phoneNumber : ""}
                                onChange={(e) => handleInputChange(e, "phoneNumber")}
                            />
                        ) : (
                            <span className="text-black/60">{user ? user.phoneNumber : "Cargando..."}</span>
                        )}
                    </p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Dirección: 
                        {editMode ? (
                            <input
                                type="text"
                                value={editedUser ? editedUser.address : ""}
                                onChange={(e) => handleInputChange(e, "address")}
                            />
                        ) : (
                            <span className="text-black/60">{user ? user.address : "Cargando..."}</span>
                        )}
                    </p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Población: 
                        {editMode ? (
                            <input
                                type="text"
                                value={editedUser ? editedUser.city : ""}
                                onChange={(e) => handleInputChange(e, "city")}
                            />
                        ) : (
                            <span className="text-black/60">{user ? user.city : "Cargando..."}</span>
                        )}
                    </p>
                    <div>
                        <p className={user && user.register ? "bg-amber-500/80 border border-radixgreen rounded-3xl text-white text-xl font-bold mt-5 p-3" + " text-center": 
                         "bg-red-500/80 border border-radixgreen rounded-3xl text-white text-xl font-bold mt-5 p-3" + " text-center"}>
                            Estado de Matrícula: {user ? user.register ? "Activa" : "Caducada" : "Cargando..."}
                        </p>
                    </div>
                    {editMode ? (
                        <div className="mt-4 text-center">
                            <Button onClick={handleSaveChanges}>Guardar</Button>
                            <Button onClick={toggleEditMode}>Cancelar</Button>
                        </div>
                    ) : (
                        <div className="mt-4 text-center">
                            <Button onClick={toggleEditMode}>Editar</Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;

