import * as Separator from "@radix-ui/react-separator";
import Rating from "../../components/Rating";
import {
  IoMdAddCircleOutline,
  IoMdSearch,
  IoIosClose,
  IoIosArrowRoundUp,
} from "react-icons/io";
import * as Toggle from "@radix-ui/react-toggle";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { HiOutlineFilter } from "react-icons/hi";
import { Button, Popover, TextField, Heading } from "@radix-ui/themes";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // Importamos Link de react-router-dom
import { getFromApi } from "../../utils/functions/api";
import AuthContext from "../../utils/context/AuthContext";
import { EquipmentImage } from "../../components/Images";

// TODO: Add picture support
const MUSCLES = ["arms", "legs", "core", "chest", "back", "shoulders", "other"];

export default function MachineList() {
  const { user } = useContext(AuthContext);
  const [filters, set_filters] = useState([]);
  const [sorting, set_sorting] = useState("name");
  const [sorting_reverse, set_sorting_reverse] = useState(false);
  const [search, set_search] = useState("");
  const [machines, setMachines] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [gym, setGym] = useState([]);
  const [machineRatings, setMachineRatings] = useState([]);
  const [reviews, setReviews] = useState({});
  const [issues, setIssues] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [filters, sorting, sorting_reverse, search, machines]);

  useEffect(() => {
    if (user?.rol === "owner") {
      getFromApi("gyms/")
        .then((response) => response.json())
        .then((data) => setGyms(data));
    }
  }, []);

  useEffect(() => {
    if (user?.rol === "gym") {
      getFromApi("gyms/detail/" + user?.username + "/")
        .then((response) => response.json())
        .then((data) => setGym(data));
    }
  }, []);

  useEffect(() => {
    getFromApi("equipments/")
      .then((response) => response.json())
      .then((data) => setMachines(data));
  }, []);

  // Machine Ratings
  useEffect(() => {
    if (machines.length > 0) {
      getFromApi("assessments/")
        .then((response) => response.json())
        .then((data) => {
          const ratingsData = machines.map((machine) => {
            const machineRatings = data
              .filter((assessment) => assessment.equipment === machine.id)
              .map((rating) => rating.stars);
            const rating = actualRate(machineRatings, machineRatings.length);

            return { id: machine.id, ratings: rating };
          });
          setMachineRatings(ratingsData);
        });
    }
  }, [machines]);

  function actualRate(ratings, length) {
    var value = 0;
    for (let i = 0; i < length; i++) {
      value += ratings[i];
    }
    return length > 0 ? value / length : 0;
  }

  const SORTING_FUNCTIONS = {
    name: (a, b) => a.name.localeCompare(b.name),
    reviews: (a, b) => reviews[b.id] - reviews[a.id],
    issues: (a, b) => issues[b.id] - issues[a.id],
    rating: (a, b) =>
      machineRatings.find((item) => item.id === b.id)?.ratings -
      machineRatings.find((item) => item.id === a.id)?.ratings,
  };

  const addFilter = (filter) => set_filters([filter, ...filters]);
  const removeFilter = (filter) =>
    set_filters(filters.filter((f) => f !== filter));

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filtered_machine_list =
    machines.length > 0
      ? machines
          .filter((m) => removeAccents(m.name).includes(removeAccents(search)))
          .filter((m) =>
            filters.length !== 0
              ? filters.some((f) => m.muscular_group.includes(f))
              : true && (selectedGym === null || m.gym === selectedGym),
          )
          .sort(
            (a, b) =>
              SORTING_FUNCTIONS[sorting](a, b) * (sorting_reverse ? -1 : 1),
          )
      : [];

  useEffect(() => {
    const promises = machines.map((machine) => {
      const assessmentPromise = getFromApi(
        `assessments/equipment/${machine.id}/`,
      ).then((response) => response.json());
      const ticketsPromise = getFromApi(
        `tickets/byEquipment/${machine.id}/`,
      ).then((response) => response.json());

      return Promise.all([assessmentPromise, ticketsPromise]).then(
        ([assessments, tickets]) => ({
          machineId: machine.id,
          reviews: assessments.length,
          issues: tickets.length,
        }),
      );
    });

    Promise.all(promises)
      .then((results) => {
        const reviewsData = {};
        const issuesData = {};

        results.forEach((result) => {
          reviewsData[result.machineId] = result.reviews;
          issuesData[result.machineId] = result.issues;
        });

        setReviews(reviewsData);
        setIssues(issuesData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [machines]);

  const handleSortingChangeReviews = (value) => {
    set_sorting("reviews");
    set_sorting_reverse(value === "desc");
  };

  const handleSortingChangeIssues = (value) => {
    set_sorting("issues");
    set_sorting_reverse(value === "desc");
  };

  const handleSortingChangeRating = (value) => {
    set_sorting("rating");
    set_sorting_reverse(value === "desc");
  };

  return (
    <>
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Mis Máquinas
      </Heading>
      <div className="flex flex-col space-y-3 md:m-0 m-5">
        <div className="flex gap-3 flex-col md:flex-row">
          <TextField.Root className="flex-1">
            <TextField.Slot>
              <IoMdSearch />
            </TextField.Slot>
            <TextField.Input
              placeholder="Buscar máquina"
              onChange={(e) => set_search(e.target.value)}
            ></TextField.Input>
          </TextField.Root>
          <Popover.Root open={open} onOpenChange={setOpen}>
            <div className="rounded flex-1 flex items-center gap-3 border border-radixgreen">
              <Popover.Trigger>
                <Button
                  name="filter"
                  radius="none"
                  size="2"
                  variant="soft"
                  className="m-0"
                >
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
            </div>
            <Popover.Content>
              <div className="flex justify-between mb-2">
                <span className="text-lg font-bold">Ordenar por</span>
                <Toggle.Root
                  name="reverse_sort"
                  pressed={sorting_reverse}
                  onPressedChange={(p) => set_sorting_reverse(p)}
                  className="bg-radixgreen/10 border border-radixgreen rounded-full text-radixgreen data-state-on:rotate-180 transition-transform"
                >
                  <IoIosArrowRoundUp className="size-7" />
                </Toggle.Root>
              </div>
              <ToggleGroup.Root
                type="single"
                defaultValue={sorting}
                onValueChange={(v) => {
                  v && set_sorting(v);
                  if (v === "reviews") {
                    handleSortingChangeReviews(
                      sorting_reverse ? "desc" : "asc",
                    );
                  } else if (v === "issues") {
                    handleSortingChangeIssues(sorting_reverse ? "desc" : "asc");
                  } else if (v === "rating") {
                    handleSortingChangeRating(sorting_reverse ? "desc" : "asc");
                  }
                }}
                className="gap-2 flex"
              >
                <ToggleGroup.Item
                  value="name"
                  className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                >
                  Nombre
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="reviews"
                  className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                >
                  Nº reseñas
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="issues"
                  className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                >
                  Nº incidencias
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="rating"
                  className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                >
                  Valoración
                </ToggleGroup.Item>
              </ToggleGroup.Root>
              <Separator.Root className="border-b my-3" />
              <div className="flex"></div>
              <span className="text-lg font-bold">Filtrar por musculos</span>
              <div className="flex gap-3 mb-3 ">
                {MUSCLES.map((m) => (
                  <Toggle.Root
                    className="capitalize transition-colors bg-radixgreen/10 text-radixgreen data-state-on:bg-radixgreen data-state-on:text-white py-1 px-2 border border-radixgreen rounded-full"
                    key={m}
                    pressed={filters.includes(m)}
                    onPressedChange={(p) =>
                      p ? addFilter(m) : removeFilter(m)
                    }
                  >
                    {m}
                  </Toggle.Root>
                ))}
              </div>

              {user?.rol === "owner" && (
                <>
                  <span className="text-lg font-bold">
                    Filtrar por gimnasios
                  </span>
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
                </>
              )}
            </Popover.Content>
          </Popover.Root>
        </div>

        <Link to="add">
          <Button size="3" className="w-full">
            <IoMdAddCircleOutline className="size-6" />
            Añadir máquina
          </Button>
        </Link>

        {filtered_machine_list.map((machine) => {
          const machineRatingData = machineRatings.find(
            (ratingData) => ratingData.id === machine.id,
          );
          var value = machineRatingData ? machineRatingData.ratings : 0;

          return (
            <Link to={`${machine.id}`} key={machine.id}>
              <Button
                name="maquina"
                key={machine.id}
                variant="soft"
                size="3"
                className="flex !justify-between !h-fit !p-2 !px-4 w-full"
              >
                <div className="flex flex-col justify-between items-start">
                  <div className="flex items-center gap-3">
                    <EquipmentImage
                      equipment={machine}
                      className="size-24 rounded-xl"
                    />
                    <span>
                      <p className="font-semibold">{machine.name}</p>
                      <Rating rating={value} />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span>
                    <svg
                      className="size-5 stroke-current fill-current inline-block mr-2"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                    </svg>
                    {reviews[machine.id] ? reviews[machine.id] : 0} reseñas
                  </span>
                  <span className="text-red-500/80">
                    <svg
                      className="fill-current size-6 inline-block mr-2"
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
                    {issues[machine.id] ? issues[machine.id] : 0} incidencias
                  </span>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </>
  );
}

