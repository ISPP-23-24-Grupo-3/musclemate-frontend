import { useEffect, useState } from "react";
import { getFromApi } from "../utils/functions/api";
import * as PropTypes from "prop-types";
import { Select } from "@radix-ui/themes";
import { RHFSelect } from "./RHFSelect";

export const EquipmentSelect = (props) => {
  const [equipment, set_equipment] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const response = await getFromApi("equipments/");
      const fetched = await response.json();
      return fetched;
    };

    !props.equipment
      ? fetchEquipment().then((e) => {
          set_equipment(e);
        })
      : set_equipment(props.equipment);
  }, [props.equipment]);

  return (
    <RHFSelect {...props} placeholder="Selecciona una máquina">
      {equipment &&
        equipment.map((e) => (
          <Select.Item key={e.id} value={e.id.toString()}>
            {e.name}
          </Select.Item>
        ))}
    </RHFSelect>
  );
};

EquipmentSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  equipment: PropTypes.array,
};
