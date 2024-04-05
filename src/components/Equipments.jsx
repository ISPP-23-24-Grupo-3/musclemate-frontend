import { useEffect, useState } from "react";
import { getFromApi } from "../utils/functions/api";
import * as PropTypes from "prop-types";
import { Select } from "@radix-ui/themes";

export const EquipmentSelect = (props) => {
  const [equipment, set_equipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    const fetchEquipment = async () => {
      const response = await getFromApi("equipments/");
      const fetched = await response.json();
      return fetched;
    };

    fetchEquipment()
      .then((e) => {
        set_equipment(e);
        setLoading(false);
      })
      .catch(() => setError("Error al buscar máquinas"));
  }, []);

  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Selecciona una máquina"></Select.Trigger>
      <Select.Content position="popper">
        {equipment.map((e) => (
          <Select.Item key={e.id} value={e.id.toString()}>
            {e.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

EquipmentSelect.propTypes = {
  onValueChange: PropTypes.func,
};
