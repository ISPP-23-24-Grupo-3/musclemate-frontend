import { useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@radix-ui/themes";


const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [gym, setGym] = useState(null);
    const [isCodeShown, setIsCodeShown] = useState(false);

    useEffect(() => {
        getFromApi("api/clients/"+userId + "/") 
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setUser(data);
            user && getFromApi("api/gyms/"+user.gym+"/")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setGym(data);
            });
        });
    }, [userId]);


    return (
        <>
            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                <div className="flex justify-center items-center bg-radixgreen/30 border-2 border-radixgreen rounded-3xl py-2 px-5 pt-8 flex-col">
                    <div>
                        <img className="w-80 h-80" src={user ? user.photo : "https://i.imgur.com/Y23W1X9.png"}
                         onError={(e) => {e.target.onerror = null; e.target.src="https://i.imgur.com/Y23W1X9.png"}}/>
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
                <div className="flex justify-center items-left flex-col pl-12">
                    <div>
                        <p className="text-radixgreen text-3xl font-bold mt-5 mb-2">Información del Usuario</p>
                        <hr className="border-radixgreen"/>
                    </div>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-5">Nombre: <span className="text-black/60">{user ? user.name+" "+user.lastName : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Fecha de Nacimiento: <span className="text-black/60">{user ? user.birth : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Mail:  <span className="text-black/60">{user ? user.email : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl font-bold mt-3">Número de Teléfono:  <span className="text-black/60">{user ? user.phoneNumber : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Dirección:  <span className="text-black/60">{user ? user.address : "Cargando..."}</span></p>
                    <p className="text-radixgreen text-xl capitalize font-bold mt-3">Población:  <span className="text-black/60">{user ? user.city : "Cargando..."}</span></p>
                    <div>
                        <p className={user && user.register ? "bg-amber-500/80 border border-radixgreen rounded-3xl text-white text-xl font-bold mt-5 p-3" + " text-center": 
                         "bg-red-500/80 border border-radixgreen rounded-3xl text-white text-xl font-bold mt-5 p-3" + " text-center"}>
                            Estado de Matrícula: {user ? user.register ? "Activa" : "Caducada" : "Cargando..."}
                        </p>
                    </div>
                </div>
            </div>

            
        </>
    );
    }

export default Profile;