import React, { useEffect, useState, useContext } from "react";
import {
  IoMdSearch,
  IoIosClose,
  IoIosArrowRoundUp,
  IoMdAddCircleOutline,
} from "react-icons/io";
import * as Toggle from "@radix-ui/react-toggle";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { HiOutlineFilter } from "react-icons/hi";
import { Button, Popover, TextField, Heading } from "@radix-ui/themes";
import * as Separator from "@radix-ui/react-separator";
import { Link } from "react-router-dom"; // Importamos Link de react-router-dom
import { getFromApi } from "../../utils/functions/api";
import SubscriptionContext from "../../utils/context/SubscriptionContext";

const INTENSITIES = ["L", "M", "H"];
const INTENSITY_NAMES = { L: "Baja", M: "Media", H: "Alta" };

const EventList = () => {
  const [filters, setFilters] = useState({
    intensity: [],
    date: [],
  });
  const [sorting, setSorting] = useState("capacity");
  const [sortingReverse, setSortingReverse] = useState(false);
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedValue, setSelectedValue] = useState("capacity");
  const [open, setOpen] = useState(false);
  const { getOwnerSubscription, ownerSubscription } = useContext(SubscriptionContext);

  useEffect(() => {
    getEvents();
    getOwnerSubscription();
  }, []);

  useEffect(() => {
    setSelectedValue(sorting === "intensity" ? "intensity" : "capacity");
  }, [filters])

  useEffect(() => {
    setOpen(false);
  }, [filters, sorting, sortingReverse, search, events]);

  async function getEvents() {
    try {
      const response = await getFromApi(`events/`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Error al obtener los eventos:", response.status);
      }
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
    }
  }

  const SORTING_FUNCTIONS = {
    capacity: (a, b) => b.capacity - a.capacity,
    intensity: (a, b) =>
      INTENSITIES.indexOf(a.intensity) - INTENSITIES.indexOf(b.intensity),
  };

  const addFilter = (filterCategory, filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: [...prevFilters[filterCategory], filter],
    }));
  };

  const removeFilter = (filterCategory, filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: prevFilters[filterCategory].filter((f) => f != filter),
    }));
  };

  const handleEventClick = (eventId) => {
    const selected = events.find((event) => event.id === eventId);
    setSelectedEvent(selected);
  };

  const filteredEventList = events
    .filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
    .filter((event) =>
      Object.entries(filters).every(([key, values]) =>
        values.length > 0 ? values.some((value) => event[key] == value) : true,
      ),
    )
    .sort(
      (a, b) => SORTING_FUNCTIONS[sorting](a, b) * (sortingReverse ? -1 : 1),
    );

  return (
    <>
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Lista de Eventos
      </Heading>

      {ownerSubscription.owner_plan === "premium" ? ( // Added condition ownerSubscription === "premium"
        <div className="flex flex-col space-y-3">
          <div className="flex gap-3 flex-col md:flex-row">
            <TextField.Root className="flex-1">
              <TextField.Slot>
                <IoMdSearch />
              </TextField.Slot>
              <TextField.Input
                placeholder="Buscar evento"
                onChange={(e) => setSearch(e.target.value)}
              />
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
                  {Object.entries(filters).map(([filter, values]) =>
                    values.map((value) => (
                      <Button
                        key={value}
                        radius="full"
                        size="1"
                        className="!pl-1 !gap-1 animate-fadein"
                        onClick={() => removeFilter(filter, value)}
                      >
                        <IoIosClose className="size-4" />
                        {value}
                      </Button>
                    )),
                  )}
                </div>
              </div>
              <Popover.Content>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">Ordenar por</span>
                  <Toggle.Root
                    name="reverse_sort"
                    pressed={sortingReverse}
                    onPressedChange={(p) => setSortingReverse(p)}
                    className="bg-radixgreen/10 border border-radixgreen rounded-full text-radixgreen data-state-on:rotate-180 transition-transform"
                  >
                    <IoIosArrowRoundUp className="size-7" />
                  </Toggle.Root>
                </div>
                <ToggleGroup.Root
                  type="single"
                  defaultValue= {selectedValue}
                  onValueChange={(v) => {
                    v && setSorting(v);
                    setSelectedValue(v);
                  }}
                  className="gap-2 flex"
                >
                  <ToggleGroup.Item
                    value="capacity"
                    className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                  >
                    Capacidad
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value="intensity"
                    className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                  >
                    Intensidad
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
                <Separator.Root className="border-b my-3" />
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-bold">Filtrar por</span>
                  <div className="flex gap-3 items-center">
                    <span>Intensidad:</span>
                    {INTENSITIES.map((intensity) => (
                      <Toggle.Root
                        key={intensity}
                        value={intensity}
                        className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                        pressed={filters.intensity.includes(intensity)}
                        onPressedChange={(p) =>
                          p
                            ? addFilter("intensity", intensity)
                            : removeFilter("intensity", intensity)
                        }
                      >
                        {INTENSITY_NAMES[intensity]}
                      </Toggle.Root>
                    ))}
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-md">Fecha:</span>
                    <TextField.Root>
                      <TextField.Input
                        name="date_filter"
                        type="date"
                        onChange={(e) => addFilter("date", e.target.value)}
                      />
                    </TextField.Root>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          </div>
          <Link to="add">
            <Button size="3" className="w-full">
              <IoMdAddCircleOutline className="size-6" />
              Añadir evento
            </Button>
          </Link>

          {filteredEventList.map((event) => (
            <Link to={`${event.id}`} key={event.id}>
              <Button
                name="event"
                key={event.id}
                size="3"
                variant="soft"
                onClick={() => handleEventClick(event.id)}
                className="flex !justify-between !h-fit !p-2 !px-4 w-full"
              >
                <div className="flex flex-col justify-between items-start">
                  <p className="font-semibold">{event.name}</p>
                  <p>{event.date}</p>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span>Capacidad: {event.capacity}</span>
                  <span>Intensidad: {INTENSITY_NAMES[event.intensity]}</span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-red-700 mt-4 text-center">
          Tu suscripción actual no incluye acceso a esta funcionalidad.
        </div>
      )}
    </>
  );
};

export default EventList;
