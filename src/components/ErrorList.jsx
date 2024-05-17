/* eslint-disable react/prop-types */

export const ErrorList = ({ errorList }) => {
  return (
    <ul className="text-red-500">
      {errorList.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
};
