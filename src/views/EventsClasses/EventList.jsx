import React, { useEffect, useState } from 'react';
import { IoMdSearch, IoIosClose, IoIosArrowRoundUp } from 'react-icons/io';
import * as Toggle from '@radix-ui/react-toggle';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { HiOutlineFilter } from 'react-icons/hi';
import { Button, Popover, TextField, Heading } from '@radix-ui/themes';
import * as Separator from '@radix-ui/react-separator';
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom
import { getFromApi } from "../../utils/functions/api";

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

  useEffect(() => {
    getEvents();
  }, []);

  function getEvents() {
    // Simulación de datos de eventos
    const sampleEvents = [
      { id: 1, name: 'Evento 1', date: '2024-03-17', capacity: 20, instructor: 'Instructor A', intensity: 'High' },
      { id: 2, name: 'Evento 2', date: '2024-03-18', capacity: 15, instructor: 'Instructor B', intensity: 'Medium' },
      { id: 3, name: 'Evento 3', date: '2024-03-19', capacity: 25, instructor: 'Instructor C', intensity: 'Low' },
    ];
    setEvents(sampleEvents);
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
    // Simulación de obtención de detalles del evento
    const selected = events.find((event) => event.id === eventId);
    setSelectedEvent(selected);
  };

  const handleClosePopover = () => {
    setSelectedEvent(null);
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
      (event) =>
        filters.date !== ''
          ? new Date(event.date).toDateString() === filters.date
          : true
    )
    .sort((a, b) => SORTING_FUNCTIONS[sorting](a, b) * (sortingReverse ? -1 : 1));

  return (
    <>
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Lista de Eventos
      </Heading>
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
                <Button radius="none" size="2" variant="soft" className="m-0">
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

        {filteredEventList.map((event) => (
          <Link to={`/event-details/${event.id}`} key={event.id}>
            <Button
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
                <span>Instructor: {event.instructor}</span>
                <span>Intensidad: {event.intensity}</span>
              </div>
            </Button>
          </Link>
        ))}
        {selectedEvent && (
          <Popover.Root onOpenChange={(isOpen) => isOpen && setSelectedEvent(null)}>
            <Popover.Anchor>
              <button>Mostrar detalles</button>
            </Popover.Anchor>
            <Popover.Content>
              <div className="bg-white border border-gray-200 rounded-md p-4">
                <p>Nombre: {selectedEvent.name}</p>
                <p>Descripción: {selectedEvent.description}</p>
                <p>Capacidad: {selectedEvent.capacity}</p>
                <p>Instructor: {selectedEvent.instructor}</p>
                <p>Fecha: {selectedEvent.date}</p>
                <p>Duración: {selectedEvent.duration}</p>
                <p>Intensidad: {selectedEvent.intensity}</p>
                <Button size="1" onClick={handleClosePopover}>Cerrar</Button>
              </div>
            </Popover.Content>
          </Popover.Root>
        )}
      </div>
    </>
  );
};

export default EventList;
