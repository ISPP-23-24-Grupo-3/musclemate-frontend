import { useEffect, useState } from "react";
import MainLayout from "../MainLayout/MainLayout";
import { Box, Button, Flex, ScrollArea, Text } from "@radix-ui/themes";
import { FaPencil } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { Outlet, useNavigate } from "react-router";
import PropTypes from "prop-types";
import { Error, Info } from "../../components/Callouts/Callouts";

export const Routines = () => {
  const [error, setError] = useState("");
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutines().then((routines) => setRoutines(routines));
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        setError(
          "There was a problem while searching your routines (Unexpected status code). Please stand by."
        );
      }
      const routines = await response.json();
      return routines;
    } catch (error) {
      setError(
        "There was a problem while searching your routines. Please stand by."
      );
    }
  };

  const addRoutine = () => navigate("new");

  return (
    <MainLayout>
      <Outlet />
      <Button
        type="submit"
        size="4"
        variant="solid"
        m="3"
        color="green"
        onClick={addRoutine}
      >
        Add routine
      </Button>

      {error ? (
        <Error message={error} size="3" />
      ) : (
        <ListRoutines routines={routines} />
      )}
    </MainLayout>
  );
};

const ListRoutines = ({ routines }) => {
  const navigate = useNavigate();
  const editRoutine = () => navigate("edit");

  const startRoutine = () => navigate("start");

  if (routines.length === 0) {
    return (
      <Info size="3" message="You don't have routines currently registered." />
    );
  }
  return (
    <ScrollArea scrollbars="vertical" size="2" mx="2" style={{ height: 400 }}>
      <Flex gap="5" direction="column">
        {routines.map((routine) => (
          <Box key={routine.id}>
            <Flex gap="2">
              <Box>
                <Text
                  style={{ textOverflow: "ellipsis" }}
                  size="6"
                  weight="bold"
                  align="left"
                >
                  {routine.title}
                </Text>
              </Box>
              <Box>
                <Button size="2" mr="2" onClick={editRoutine}>
                  <FaPencil />
                </Button>
                <Button size="2" onClick={startRoutine}>
                  <CgGym />
                </Button>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>
    </ScrollArea>
  );
};

ListRoutines.propTypes = {
  routines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};
