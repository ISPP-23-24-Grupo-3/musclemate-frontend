/* eslint-disable react/prop-types */
import { Card } from "@radix-ui/themes";

export const FormContainer = ({ children, className }) => {
  return (
    <Card className={`p-2 sm:p-4 md:px-8 shadow-md ${className}`}>
      {children}
    </Card>
  );
};
