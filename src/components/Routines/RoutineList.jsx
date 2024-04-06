import { useEffect, useState } from "react";
import { getFromApi } from "../../utils/functions/api";
import { IconButton, Link, Text } from "@radix-ui/themes";
import { CgGym, CgSpinner } from "react-icons/cg";
import { LuPencil } from "react-icons/lu";
import { Error, Info } from "../Callouts/Callouts";

const Routine = ({ routine }) => {
  return (
    <>
      <div className="flex bg-radixgreen/10 items-center p-4 justify-between rounded-lg gap-3">
        <span className="flex gap-3 items-center">
          <Text style={{ textOverflow: "ellipsis" }} size="4" weight="bold">
            {routine.name}
          </Text>
        </span>
        <span className="flex gap-2">
          <Link href={`./routines/${routine.id}/train`}>
            <IconButton size="2" radius="full">
              <CgGym className="size-5 rotate-30" />
            </IconButton>
          </Link>

          <Link href={`./routines/${routine.id}`}>
            <IconButton size="2" radius="full">
              <LuPencil className="size-4" />
            </IconButton>
          </Link>
        </span>
      </div>
    </>
  );
};

export const RoutineList = () => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const response = await getFromApi("routines/");
      const fetchedRoutines = await response.json();
      return fetchedRoutines;
    };

    fetchRoutines().then((r) => setRoutines(r));
  });

  return (
    <>
      <div className="flex flex-col gap-2 overflow-hidden">
        {routines.slice(0, 5).map((r) => (
          <Routine routine={r} key={r.id} />
        ))}
      </div>
    </>
  );
};
