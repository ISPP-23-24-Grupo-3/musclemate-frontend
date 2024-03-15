import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getFromApi } from "../../utils/functions/api";
import { Container, Flex, Heading } from '@radix-ui/themes';

import AuthContext from "../../utils/context/AuthContext";

const MyGymsOwner = () => {
  const { user } = useContext(AuthContext);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        if (!user) return; // Verificar si el usuario está autenticado
        const userId = user.id; // Obtener el ID del usuario actual

        // Realizar una solicitud GET para obtener todos los gimnasios
        const response = await getFromApi(`gyms/`);
        if (response.ok) {
          const data = await response.json();
          // Filtrar los gimnasios para obtener solo los que coincidan con el userID
          const userGyms = data.filter(gym => gym.owner === userId);
          setGyms(userGyms);
          setLoading(false);
        } else {
          console.error("Error al obtener los gimnasios:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener los gimnasios:", error);
      }
    };

    fetchGyms();
  }, [user]);

  return (
    <Container>
      <Flex direction="column" align="center">
        <Heading size="6" className="mt-8 mb-3 text-center">
          Mis Gimnasios
        </Heading>
        {loading ? (
          <p>Cargando...</p>
        ) : gyms.length === 0 ? (
          <p>No eres propietario de ningún gimnasio.</p>
        ) : (
          gyms.map(gym => (
            <div key={gym.id} className="mb-4">
              <Link to={`/gyms/${gym.id}`}>
                <p>{gym.name}</p>
              </Link>
            </div>
          ))
        )}
      </Flex>
    </Container>
  );
};

export default MyGymsOwner;
