import { useState, useEffect } from "react";
import { IoMdAddCircleOutline, IoMdSearch } from "react-icons/io";
import { Button, TextField, Heading } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";
import { Link } from "react-router-dom";

const MyGymsOwner = () => {
  const [gyms, setGyms] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchGyms = async () => {
    try {
      const response = await getFromApi("gyms/");
      if (response.ok) {
        const data = await response.json();
        setGyms(data);
      } else {
        setErrorMessage("Error al obtener los gimnasios.");
      }
    } catch (error) {
      setErrorMessage("Error al obtener los gimnasios.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Mis Gimnasios
      </Heading>

      <div className="flex flex-col space-y-3">
        <div className="flex gap-3 flex-col md:flex-row">
          <TextField.Root className="flex-1">
            <TextField.Slot>
              <IoMdSearch />
            </TextField.Slot>
            <TextField.Input
              placeholder="Buscar gimnasio"
              onChange={(e) => setSearch(e.target.value)}
            ></TextField.Input>
          </TextField.Root>
        </div>

        <Link to="/owner/gyms/add">
          <Button size="3" className="w-full">
            <IoMdAddCircleOutline className="size-6" />
            Crear Nuevo Gimnasio
          </Button>
        </Link>

        {isLoading ? (
          <p>Cargando...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : filteredGyms.length === 0 ? (
          <p>No se encontraron gimnasios.</p>
        ) : (
          <div className="flex flex-col" style={{ width: "100%" }}>
            {filteredGyms.map((gym, index) => (
              <Link key={gym.id} to={`/owner/gyms/${gym.id}`}>
                <div style={{ width: "100%", marginBottom: "10px" }}>
                  <Button
                    variant="soft"
                    size="3"
                    className="w-full flex !justify-between !h-fit !p-2 !px-4"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold">{gym.name}</p>
                    </div>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <br />
    </>
  );
};

export default MyGymsOwner;
