/* eslint-disable react/prop-types */
import { Card } from "@radix-ui/themes";

export const FormContainer = ({ children, className }) => {
  return <Card className={`p-4 px-8 shadow-md ${className}`}>{children}</Card>;
};
