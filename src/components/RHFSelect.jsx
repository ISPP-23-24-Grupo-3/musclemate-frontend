import { Select } from "@radix-ui/themes";
import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const RHFSelect = forwardRef(({
  children,
  className,
  defaultValue,
  placeholder,
  name,
  onChange,
  radius,
  variant,
  size,
},ref) => {
  return (
    <Select.Root
      defaultValue={defaultValue}
      className={className}
      name={name}
      onValueChange={(v) => onChange({ target: { name, value: v } })}
      size={size}
    >
      <Select.Trigger
        placeholder={placeholder}
        variant={variant}
        radius={radius}
      />
      <Select.Content position="popper">{children}</Select.Content>
    </Select.Root>
  );
});

RHFSelect.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  radius: PropTypes.string,
  defaultValue: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
};
