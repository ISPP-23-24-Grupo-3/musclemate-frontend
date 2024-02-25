import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import lista from "./lista.txt";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().startsWith(search.toLowerCase()) &&
      (filterState === "" || user.state === filterState)
  );

  useEffect(() => {
    fetch(lista)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Buscar usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={busca}
        />

        <FontAwesomeIcon icon={faFilter} />
        <select style={busca2} onChange={(e) => setFilterState(e.target.value)}>
          <option value="">Sin Filtro</option>
          <option value="Activa">Matrícula Activa</option>
          <option value="Caducada">Matrícula Caducada</option>
        </select>
      </div>

      <ul>
        <li>
          <div
            style={{
              ...index,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            NOMBRE DEL USUARIO <div>ESTADO DE MATRÍCULA</div>
          </div>
        </li>
        {filteredUsers.map((user, index) => (
          <li key={index} style={listing}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to={"/users/" + user.id} style={name}>
                {user.name}
              </Link>
              <div
                style={{
                  ...states,
                  backgroundColor:
                    user.state === "Activa" ? "#E3D452" : "#ff8f8f",
                }}
              >
                {user.state}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

const index = {
  padding: "15px",
  backgroundColor: "#30A46C",
  borderRadius: "5px",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "10px",
  fontSize: "20px",
};

const listing = {
  backgroundColor: "#8fff8f",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  textAlign: "center",
  fontWeight: "bold",
};

const name = {
  padding: "10px",
  fontSize: "22px",
};

const states = {
  padding: "10px",
  borderRadius: "5px",
  fontSize: "20px",
};

const busca = {
  padding: "10px",
  border: "2px solid #30A46C",
  borderRadius: "5px",
  marginBottom: "20px",
  textAlign: "left",
  fontWeight: "bold",
  width: "100%",
};

const busca2 = {
  padding: "10px",
  border: "2px solid #30A46C",
  borderRadius: "5px",
  marginBottom: "20px",
  textAlign: "left",
  fontWeight: "bold",
};

export default Users;
