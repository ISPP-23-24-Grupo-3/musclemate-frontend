/* eslint-disable react/prop-types */
import { Select } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { getFromApi } from "../utils/functions/api";
import { RHFSelect } from "./RHFSelect";

export const GymSelect = (props) => {
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    async function getGyms() {
      const responseGym = await getFromApi("gyms/");
      return responseGym.json();
    }

    getGyms()
      .then((gyms) => setGyms(gyms))
      .catch((error) => console.log(error));
  }, []);

  return (
    <RHFSelect {...props} placeholder="Seleccionar gimnasio">
      {gyms &&
        gyms.map((gym) => (
          <Select.Item key={gym.id} value={gym.id.toString()}>
            {gym.name}
          </Select.Item>
        ))}
    </RHFSelect>
  );
};
