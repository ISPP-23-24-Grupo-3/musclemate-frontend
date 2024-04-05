/* eslint-disable react/prop-types */
import { Select } from "@radix-ui/themes";
import React from "react";

export const RHFSelect = ({
  children,
  className,
  defaultValue,
  placeholder,
  name,
  onChange,
}) => {
  return (
    <Select.Root
      defaultValue={defaultValue}
      className={className}
      name={name}
      onValueChange={(v) => onChange({ target: { name, value: v } })}
    >
      <Select.Trigger placeholder={placeholder} />
      <Select.Content position="popper">{children}</Select.Content>
    </Select.Root>
  );
};
