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
import {
  Button,
  Popover,
  TextField,
  Heading,
  IconButton,
} from "@radix-ui/themes";
import { useState } from "react";

// TODO: Add picture support
const MUSCLES = ["hombros", "brazos", "espalda"];
const MACHINES = [
  {
    id: 0,
    name: "Bench Press",
    description:
      "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
    // picture: ""
    muscles: ["hombros", "brazos", "espalda"],
    reviews: [
      {
        id: 0,
        user: "Pepito",
        rating: 4,
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        datetime: new Date("2024-02-22 08:00"),
      },
      {
        id: 1,
        user: "Josefina",
        rating: 4.5,
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        datetime: new Date("2024-02-22 11:00"),
      },
      {
        id: 2,
        user: "Consuelo",
        rating: 4,
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        datetime: new Date("2024-02-22 09:00"),
      },
    ],
    issues: [
      {
        id: 0,
        user: "Pepito",
        categories: ["Needs repairing"],
        datetime: new Date("2024-02-22 11:00"),
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      },
      {
        id: 1,
        user: "Josefina",
        categories: ["Needs cleaning"],
        datetime: new Date("2024-02-22 11:00"),
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      },
    ],
  },
  {
    id: 1,
    name: "Weights",
    description:
      "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
    // picture: ""
    muscles: ["hombros", "brazos"],
    reviews: [
      {
        id: 3,
        user: "Pepito",
        rating: 2.5,
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        datetime: new Date("2024-02-22 08:00"),
      },
      {
        id: 4,
        user: "Josefina",
        rating: 4.5,
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        datetime: new Date("2024-02-22 11:00"),
      },
      {
        id: 5,
        user: "Consuelo",
        rating: 2,
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        datetime: new Date("2024-02-22 09:00"),
      },
    ],
    issues: [
      {
        user: "Pepito",
        categories: ["Needs repairing"],
        datetime: new Date("2024-02-22 11:00"),
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      },
      {
        user: "Josefina",
        categories: ["Needs cleaning"],
        datetime: new Date("2024-02-22 11:00"),
        description:
          "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      },
    ],
  },
];

export default function MachineList() {
  const [filters, set_filters] = useState([]);
  const [sorting, set_sorting] = useState("name");
  const [sorting_reverse, set_sorting_reverse] = useState(false);
  const [search, set_search] = useState("");

  const SORTING_FUNCTIONS = {
    name: (a, b) => a.name.localeCompare(b.name),
    issues: (a, b) => a.reviews.length - b.reviews.length,
    reviews: (a, b) => a.issues.length - b.issues.length,
    rating: (a, b) => {
      const a_rating =
        a.reviews
          .map((r) => r.rating)
          .reduce((previous, current) => {
            return previous + current;
          }, 0) / a.reviews.length;
      const b_rating =
        b.reviews
          .map((r) => r.rating)
          .reduce((previous, current) => {
            return previous + current;
          }, 0) / b.reviews.length;
      return a_rating - b_rating;
    },
  };

  const addFilter = (filter) => set_filters([filter, ...filters]);
  const removeFilter = (filter) =>
    set_filters(filters.filter((f) => f != filter));

  const filtered_machine_list = MACHINES.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  )
    .filter((m) =>
      filters.length != 0 ? filters.some((f) => m.muscles.includes(f)) : true,
    )
    .sort(
      (a, b) => SORTING_FUNCTIONS[sorting](a, b) * (sorting_reverse ? -1 : 1),
    );

  return (
    <>
      <Heading
        size="8"
        className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
      >
        Mis Máquinas
      </Heading>
      <div className="flex flex-col space-y-3">
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
          <Popover.Root>
            <div className="rounded flex-1 flex items-center gap-3 border border-radixgreen">
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
                    onClick={(_) => removeFilter(f)}
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
                  onPressedChange={(p) => set_sorting_reverse(p)}
                  className="bg-radixgreen/10 border border-radixgreen rounded-full text-radixgreen data-state-on:rotate-180 transition-transform"
                >
                  <IoIosArrowRoundUp className="size-7" />
                </Toggle.Root>
              </div>
              <ToggleGroup.Root
                type="single"
                defaultValue="name"
                onValueChange={(v) => set_sorting(v)}
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
              <span className="text-lg font-bold">Filtrar por</span>
              <div className="flex gap-3">
                {MUSCLES.map((m) => (
                  <Toggle.Root
                    className="capitalize transition-colors bg-radixgreen/10 text-radixgreen data-state-on:bg-radixgreen data-state-on:text-white py-1 px-2 border border-radixgreen rounded-full"
                    key={m}
                    onPressedChange={(p) =>
                      p ? addFilter(m) : removeFilter(m)
                    }
                  >
                    {m}
                  </Toggle.Root>
                ))}
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>

        <Button size="3">
          <IoMdAddCircleOutline className="size-6" />
          Añadir máquina
        </Button>

        {filtered_machine_list.map((machine) => {
          const ratings = machine.reviews.map((review) => review.rating);
          const avg_rating =
            ratings.reduce((previous, current) => {
              return previous + current;
            }, 0) / ratings.length;
          const issues = machine.issues.length;
          const reviews = machine.reviews.length;

          return (
            <Button
              key={machine.id}
              variant="soft"
              size="3"
              className="flex !justify-between !h-fit !p-2 !px-4"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{machine.name}</p>
                <Rating rating={avg_rating} />
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
                  {reviews} reseñas
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
                  {issues} incidencias
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </>
  );
}
