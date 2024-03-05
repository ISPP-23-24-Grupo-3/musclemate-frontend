import { Callout } from "@radix-ui/themes";
import { CiCircleInfo } from "react-icons/ci";
import PropTypes from "prop-types";

export const Info = ({ message, size }) => {
  return (
    <Callout.Root size={size}>
      <Callout.Icon>
        <CiCircleInfo />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
};

Info.propTypes = {
  message: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["1", "2", "3"]).isRequired,
};

export const Error = ({ message, size }) => {
  return (
    <Callout.Root color="red" size={size}>
      <Callout.Icon>
        <CiCircleInfo />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["1", "2", "3"]),
};
