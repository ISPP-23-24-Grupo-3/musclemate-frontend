import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { IoMdAddCircleOutline, IoMdSearch, IoIosClose } from "react-icons/io";
import * as Toggle from "@radix-ui/react-toggle";
import { HiOutlineFilter } from "react-icons/hi";
import { Button, Popover, TextField, Heading } from "@radix-ui/themes";
import { getFromApi } from "../../utils/functions/api";
import { PopoverAnchor } from "radix-ui";

const MATRICULA = ["Activa", "Caducada"];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState("");

  useEffect(() => {
    async function fetchGyms() {
      const response = await getFromApi("gyms/");
      const data = await response.json();
      setGyms(data);
    }
    fetchGyms();
  }, []);


  useEffect(() => {
    const result = users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((user) =>
        filters != 0
          ? filters.some((f) => (user.register ? "Activa" : "Caducada") === f)
          : true
      )
      .filter((user) =>
        selectedGym ? user.gym === selectedGym : true
      );

    setFilteredUsers(result);
  }, [users, search, filters, selectedGym,gyms]);

  const addFilter = (filter) => setFilters([filter, ...filters]);
  const removeFilter = (filter) =>
    setFilters(filters.filter((f) => f != filter));

  function getUsers() {
    getFromApi("clients/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      });
  }

  useEffect(() => {
    getUsers();
  }, [selectedGym,gyms]);

  return (
    <>
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Usuarios
      </Heading>

      <div className="flex flex-col space-y-3 md:m-0 m-5">
        <div className="flex gap-3 flex-col md:flex-row">
          <TextField.Root className="flex-1">
            <TextField.Slot>
              <IoMdSearch />
            </TextField.Slot>
            <TextField.Input
              placeholder="Buscar usuario"
              onChange={(e) => setSearch(e.target.value)}
            ></TextField.Input>
          </TextField.Root>

          <Popover.Root open={open} onOpenChange={setOpen}>
            <PopoverAnchor className="rounded flex-1 flex items-center gap-3 border border-radixgreen">
              <Popover.Trigger>
                <Button radius="none" size="2" variant="soft" className="m-0">
                  <HiOutlineFilter />
                </Button>
              </Popover.Trigger>

              <div className="flex-1 flex gap-2">
                {filters.map((f) => (
                  <Button
                    key={f}
                    radius="full"
                    size="1"
                    className="!pl-1 !gap-1 animate-fadein"
                    onClick={() => removeFilter(f)}
                  >
                    <IoIosClose className="size-4" />
                    {f}
                  </Button>
                ))}
              </div>
            </PopoverAnchor>

            <Popover.Content>
              <div className="flex">
              <span className="text-lg font-bold">Filtrar por Matrícula</span>
              <div className="flex gap-3">
                {MATRICULA.map((m) => (
                  <Toggle.Root
                    className="capitalize transition-colors bg-radixgreen/10 text-radixgreen data-state-on:bg-radixgreen data-state-on:text-white py-1 px-2 border border-radixgreen rounded-full"
                    key={m}
                    pressed={filters.includes(m)}
                    onPressedChange={(p) =>{
                      p ? addFilter(m) : removeFilter(m)
                      setOpen(false);
                    }}
                  >
                    {m}
                  </Toggle.Root>
                ))}
              </div>
              <div className="flex">
              <span className="text-lg font-bold mt-4">Filtrar por Gimnasio</span>
              <div className="flex gap-3">
                    {gyms.map((gym) => (
                      <Toggle.Root
                        key={gym.id}
                        pressed={selectedGym === gym.id}
                        className={`capitalize transition-colors bg-radixgreen/10 text-radixgreen ${
                          selectedGym === gym.id
                            ? "data-state-on:bg-radixgreen data-state-on:text-white"
                            : ""
                        } 
                          py-1 px-2 border border-radixgreen rounded-full`}
                        onPressedChange={(p) => {
                          p ? setSelectedGym(gym.id) : setSelectedGym(null);
                          setOpen(false);
                        }}
                      >
                        {gym.name}
                      </Toggle.Root>
                    ))}
                  </div>
              </div>
            </div>
            </Popover.Content>
          </Popover.Root>
        </div>

        <Link to="register" className="flex flex-col">
          <Button size="3">
            <IoMdAddCircleOutline className="size-6" />
            Añadir nuevo usuario
          </Button>
        </Link>

        {filteredUsers.length != 0 ? (
          filteredUsers.map((users) => {
            return (
              <Link
                to={`${users.id}/profile`}
                key={users.id}
                className="flex flex-col"
              >
                <Button
                  key={users.id}
                  variant="soft"
                  size="3"
                  className="flex !justify-between !h-fit !p-2 !px-4"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold">
                      {users.name} {users.lastName}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`${
                        users.register ? "" : "text-red-500/80"
                      } flex items-center gap-1`}
                    >
                      {!users.register && (
                        <svg
                          className="fill-current size-5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25Z" />
                          <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" />
                          <path
                            d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z"
                            fillRule="evenodd"
                          />
                        </svg>
                      )}
                      {users.register ? "Activa" : "Caducada"}
                    </span>
                  </div>
                </Button>
              </Link>
            );
          })
        ): (
          <div className="flex justify-center items-center h-96">
            <p className="text-xl font-semibold text-gray-500">No hay usuarios</p>
          </div>
        )}
        
        
      </div>
      <br />
    </>
  );
};

export default Users;
