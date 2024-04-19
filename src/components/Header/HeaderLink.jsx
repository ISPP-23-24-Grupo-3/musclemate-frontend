import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const HeaderLink = ({ to, children }) => {
  return (
    <li className="max-lg:border-b max-lg:py-2 px-3 max-lg:rounded">
      <Link
        to={to}
        className="lg:hover:text-radixgreen text-black block font-semibold text-lg"
      >
        {children}
      </Link>
    </li>
  );
};

HeaderLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
};

export default HeaderLink;
