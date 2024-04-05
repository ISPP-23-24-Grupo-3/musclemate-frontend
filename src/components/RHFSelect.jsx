/* eslint-disable react/prop-types */
import { Select } from "@radix-ui/themes";

export const RHFSelect = ({
  children,
  className,
  defaultValue,
  name,
  onChange,
  ref,
}) => {
  return (
    <Select.Root
      defaultValue={defaultValue}
      className={className}
      name={name}
      onValueChange={(v) => onChange({ target: { name, value: v } })}
    >
      {children}
    </Select.Root>
  );
};
