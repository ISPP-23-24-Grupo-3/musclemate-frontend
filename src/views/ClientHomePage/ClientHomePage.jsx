import { Button, Container, Flex, Heading, Link } from "@radix-ui/themes";
import React from "react";
import { RoutineList } from "../../components/Routines/RoutineList";

export default function ClientHomePage() {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div>
          <Heading as="h1" className="!mb-3">
            <Link href="./routines">Tus Rutinas</Link>
          </Heading>
          <RoutineList />
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
