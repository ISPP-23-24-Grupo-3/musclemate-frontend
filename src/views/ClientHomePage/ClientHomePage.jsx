import { Button, Container, Flex, Heading, Link } from "@radix-ui/themes";
import { React, useContext, useEffect, useState } from "react";
import { RoutineList } from "../../components/Routines/RoutineList";
import AuthContext from "../../utils/context/AuthContext";
import { getFromApi } from "../../utils/functions/api";

export default function ClientHomePage() {

  const { user } = useContext(AuthContext);
  const [gymPlan, setGymPlan] = useState("");

  useEffect(() => {
    if (user) {
        getFromApi("clients/detail/" + user.username + "/") 
            .then((response) => response.json())
            .then((data) => {
              let gym = data.gym;
              getFromApi("gyms/detail/" + gym + "/") 
              .then((response) => response.json())
              .then((data) => {
                setGymPlan(data.subscription_plan);
              });
            });
    }
  }, [user]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div>
          <Heading as="h1" className="!mb-3">
            <Link href="./routines">Tus Rutinas</Link>
          </Heading>
          {gymPlan !== "free" ? (
            <RoutineList />
          ) : (
            <div className="text-red-700">La subscripción de tu gimnasio no incluye esta funcionalidad.</div>
          )}
        </div>
        <div>
          <Heading as="h1">
            <Link href="./events">Tus Eventos</Link>
          </Heading>
          {/*TODO: Add booked events here*/}
        </div>
        <div>
          <Heading as="h1">
            <Link href="./routines">Tu Evolución</Link>
          </Heading>
          {/*TODO: Add routine stats here*/}
        </div>
      </div>
    </>
  );
}
