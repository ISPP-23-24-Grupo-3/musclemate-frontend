import { useState, useEffect } from "react";
import { IoMdAddCircleOutline, IoMdSearch} from "react-icons/io";
import { Button, TextField, Heading } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";

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

  const handleLinkClick = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Heading size="8" className="text-radixgreen !mt-8 !mb-3 text-center md:text-left">
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

        {/* <Button size="3" onClick={handleLinkClick}>
          <IoMdAddCircleOutline className="size-6" />
          Crear Nuevo Gimnasio
        </Button> */}

        {isLoading ? (
          <p>Cargando...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : filteredGyms.length === 0 ? (
          <p>No se encontraron gimnasios.</p>
        ) : (
          filteredGyms.map((gym) => (
            <div key={gym.id} className="flex flex-col">
              <Button key={gym.id} variant="soft" size="3" className="flex !justify-between !h-fit !p-2 !px-4" onClick={handleLinkClick}>
                <div className="flex flex-col">
                  <p className="font-semibold">{gym.name}</p>
                </div>
              </Button>
            </div>
          ))
        )}
      </div><br/>
    </>
  );
};

export default MyGymsOwner;
