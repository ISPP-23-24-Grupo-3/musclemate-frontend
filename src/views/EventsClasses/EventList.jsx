import React, { useEffect, useState, useContext } from 'react';
import { IoMdSearch, IoIosClose, IoIosArrowRoundUp, IoMdAddCircleOutline } from 'react-icons/io';
import * as Toggle from '@radix-ui/react-toggle';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { HiOutlineFilter } from 'react-icons/hi';
import { Button, Popover, TextField, Heading } from '@radix-ui/themes';
import * as Separator from '@radix-ui/react-separator';
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom
import { getFromApi } from "../../utils/functions/api";
import SubscriptionContext from '../../utils/context/SubscriptionContext';

const INTENSITIES = ['Low', 'Medium', 'High'];

const EventList = () => {
  const [filters, setFilters] = useState({
    intensity: [],
    date: '',
  });
  const [sorting, setSorting] = useState('capacity');
  const [sortingReverse, setSortingReverse] = useState(false);
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { getOwnerSubscription, ownerSubscription } = useContext(SubscriptionContext)

  useEffect(() => {
    getEvents();
    getOwnerSubscription();
  }, []);

  console.log(ownerSubscription)

  async function getEvents() {
    try {
      const response = await getFromApi(`events/`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Error al obtener los eventos:', response.status);
      }
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
    }
  }

  const SORTING_FUNCTIONS = {
    capacity: (a, b) => b.capacity - a.capacity,
  };

  const addFilter = (filterCategory, filter) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: [...prevFilters[filterCategory], filter],
    }));

  const removeFilter = (filterCategory, filter) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: prevFilters[filterCategory].filter((f) => f !== filter),
    }));

  const handleEventClick = (eventId) => {
    const selected = events.find((event) => event.id === eventId);
    setSelectedEvent(selected);

  };

  const clearDateFilter = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: '',
    }));
  };

  const filteredEventList = events
    .filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (event) =>
        filters.intensity.length !== 0
          ? filters.intensity.includes(event.intensity)
          : true
    )
    .filter(
      (event) => {
        if (filters.date !== '') {
          const filterDate = new Date(filters.date);
          const eventDate = new Date(event.date);
          return filterDate.toDateString() === eventDate.toDateString();

        } else {
          return true;
        }
      })
    .sort((a, b) => SORTING_FUNCTIONS[sorting](a, b) * (sortingReverse ? -1 : 1));

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
            <Popover.Root>
              <div className="rounded flex-1 flex items-center gap-3 border border-radixgreen">
                <Popover.Trigger>
                  <Button name="filter" radius="none" size="2" variant="soft" className="m-0">
                    <HiOutlineFilter />
                  </Button>
                </Popover.Trigger>
                <div className="flex-1 flex gap-2">
                  {filters.intensity.map((intensity) => (
                    <Button
                      key={intensity}
                      radius="full"
                      size="1"
                      className="!pl-1 !gap-1 animate-fadein"
                      onClick={() => removeFilter('intensity', intensity)}
                    >
                      <IoIosClose className="size-4" />
                      {intensity}
                    </Button>
                  ))}
                </div>
              </div>
              <Popover.Content>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">Ordenar por</span>
                  <Toggle.Root
                    onPressedChange={(p) => setSortingReverse(p)}
                    className="bg-radixgreen/10 border border-radixgreen rounded-full text-radixgreen data-state-on:rotate-180 transition-transform"
                  >
                    <IoIosArrowRoundUp className="size-7" />
                  </Toggle.Root>
                </div>
                <ToggleGroup.Root
                  type="single"
                  defaultValue="capacity"
                  onValueChange={(v) => v && setSorting(v)}
                  className="gap-2 flex"
                >
                  <ToggleGroup.Item
                    value="capacity"
                    className="transition-colors data-state-on:bg-radixgreen rounded-full bg-radixgreen/10 text-radixgreen data-state-on:text-white px-2 py-1 border border-radixgreen"
                  >
                    Capacidad
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
                <button onClick={clearDateFilter}>Limpiar</button>
                <Separator.Root className="border-b my-3" />
                <div className="flex">
                  <span className="text-lg font-bold">Filtrar por</span>
                  <div className="flex gap-3">
                    {INTENSITIES.map((intensity) => (
                      <Toggle.Root
                        key={intensity}
                        className="capitalize transition-colors bg-radixgreen/10 text-radixgreen data-state-on:bg-radixgreen data-state-on:text-white py-1 px-2 border border-radixgreen rounded-full"
                        onPressedChange={(p) =>
                          p
                            ? addFilter('intensity', intensity)
                            : removeFilter('intensity', intensity)
                        }
                      >
                        {intensity}
                      </Toggle.Root>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <span className="text-lg font-bold">Filtrar por fecha:</span>
                    <TextField.Root>
                      <TextField.Input
                      name="date_filter"
                        type="date"
                        onChange={(e) =>
                          setFilters({ ...filters, date: e.target.value })
                        }
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

{
  filteredEventList.map((event) => (
    <Link to={`${event.id}`} key={event.id}>
      <Button
        name="event"
        key={event.id}
        size="3"
        onClick={() => handleEventClick(event.id)}
        className="flex !justify-between !h-fit !p-2 !px-4 w-full"
      >
        <div className="flex flex-col justify-between items-start">
          <p className="font-semibold">{event.name}</p>
          <p>{event.date}</p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span>Capacidad: {event.capacity}</span>
          <span>Intensidad: {event.intensity}</span>
        </div>
      </Button>
    </Link>
  ))
}
            
              
        </div>) : (
          <div className="text-red-700 mt-4 text-center">Tu suscripción actual no incluye acceso a esta funcionalidad, ¡obten tu subscripción premium en la pestaña de subscripciones!.</div>
        )}
    </>
  );
};

export default EventList;
