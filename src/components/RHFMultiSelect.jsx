import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Select } from "@radix-ui/themes";

export const RHFMultiSelect = forwardRef(
  (
    {
      children,
      className,
      defaultValue,
      placeholder,
      name,
      onChange,
      radius,
      variant,
      size,
      disabled,
    },
    ref,
  ) => {
    // Inicializamos el estado con un array vacío o con el valor por defecto
    const [selectedOptions, setSelectedOptions] = useState(
      defaultValue || []
    );

    // Función para manejar la selección de opciones
    const handleSelectOption = (value) => {
        // Verificamos si la opción ya está seleccionada
        const isSelected = selectedOptions.includes(value);
      
        // Creamos una nueva lista de opciones seleccionadas
        let newSelectedOptions;
      
        if (isSelected) {
          // Si la opción ya está seleccionada, la eliminamos de la lista
          newSelectedOptions = selectedOptions.filter((option) => option !== value);
        } else {
          // Si la opción no está seleccionada, la añadimos a la lista
          newSelectedOptions = [...selectedOptions, value];
        }
      
        // Actualizamos el estado con la nueva lista de opciones seleccionadas
        setSelectedOptions(newSelectedOptions);
      
        // Enviamos la lista de opciones seleccionadas al controlador de cambio
        onChange({ target: { name, value: newSelectedOptions } });
      };
      
      

    return (
      <Select.Root
        className={className}
        name={name}
        size={size}
        ref={ref}
      >
        <Select.Trigger
          placeholder={placeholder}
          variant={variant}
          radius={radius}
          disabled={disabled}
        />
        <Select.Content position="popper">
          <div className="flex flex-wrap gap-2">
            {React.Children.map(children, (child) => (
              <div
                key={child.props.value}
                className={`flex items-center px-2 py-1 rounded-md ${
                  selectedOptions.includes(child.props.value)
                    ? "bg-gray-200"
                    : "hover:bg-gray-200 cursor-pointer"
                }`}
                onClick={() => handleSelectOption(child.props.value)}
              >
                {child.props.children}
              </div>
            ))}
          </div>
        </Select.Content>
      </Select.Root>
    );
  }
);

RHFMultiSelect.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  radius: PropTypes.string,
  defaultValue: PropTypes.arrayOf(PropTypes.string), // Mantenido como array de strings
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};
