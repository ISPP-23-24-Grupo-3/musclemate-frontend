import { Button, Flex, Heading } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'

export default function ClientHomePage() {
  return (
    <>
      <Flex align="center" justify="center" direction="row">
        <Heading
          size="6"
          className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
        >
          Bienvenido a
        </Heading>
        <img src="/pwa-64x64.png" alt="Logo" className="ml-2 mr-1 mt-3" />
        <Heading size="6" className="!mt-8 !mb-3 text-center">
          MuscleMate
        </Heading>
      </Flex>

      <Flex direction="column" justify="center" align="center" gap="4">
        <Link to="../routines">
          <Button size="4" variant="classic" className="mt-4">
            Mis Rutinas
          </Button>
        </Link>
        <Link to="../add-tickets">
          <Button size="4" variant="classic" className="mt-4">
            Crear un ticket
          </Button>
        </Link>
        <Link to="../events">
          <Button size="4" variant="classic" className="mt-4">
            Eventos
          </Button>
        </Link>
        <Link to="../profile">
          <Button size="4" variant="classic" className="mt-4">
            Mi Perfil
          </Button>
        </Link>
      </Flex>
    </>
  )
}
