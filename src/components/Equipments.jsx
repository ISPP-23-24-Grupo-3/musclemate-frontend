import { useEffect, useState } from "react";
import { getFromApi } from "../utils/functions/api";
import * as PropTypes from "prop-types";
import { Select } from "@radix-ui/themes";
import { RHFSelect } from "./RHFSelect";

export const EquipmentSelect = ({ props, ref }) => {
  const [equipment, set_equipment] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const response = await getFromApi("equipments/");
      const fetched = await response.json();
      return fetched;
    };

    fetchEquipment().then((e) => {
      set_equipment(e);
    });
  }, []);

  return (
    <RHFSelect {...props}>
      <Select.Trigger placeholder="Selecciona una máquina"></Select.Trigger>
      <Select.Content position="popper">
        {equipment.map((e) => (
          <Select.Item key={e.id} value={e.id.toString()}>
            {e.name}
          </Select.Item>
        ))}
      </Select.Content>
    </RHFSelect>
  );
};

EquipmentSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
