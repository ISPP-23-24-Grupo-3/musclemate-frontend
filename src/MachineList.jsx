import Rating from "./components/Rating";

// TODO: Add picture support
const MACHINES = [
  {
    id: 0,
    name: "Bench Press",
    description:
      "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
    // picture: ""
    muscles: ["shoulders", "arms"],
    reviews: [
      {
        id: 0,
        user: "Pepito",
        rating: 3.5,
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
        rating: 2,
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
    name: "Bench Press 2",
    description:
      "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
    // picture: ""
    muscles: ["shoulders", "arms"],
    reviews: [
      {
        id: 3,
        user: "Pepito",
        rating: 3.5,
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
  return (
    <>
      <h1>My Machines</h1>
      <div className="flex flex-col space-y-3">
        {MACHINES.map((machine) => {
          const ratings = machine.reviews.map((review) => review.rating);
          const avg_rating =
            ratings.reduce((previous, current) => {
              return previous + current;
            }, 0) / ratings.length;

          return (
            <div
              key={machine.id}
              className="flex rounded-lg border-primary border p-3"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{machine.name}</p>
                <Rating rating={avg_rating} />
              </div>
              <div></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
