import { Button, Dialog, Flex } from "@radix-ui/themes";

export function RemoveAccount() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex gap="3" mt="3" justify="center">
          <Button size="3" variant="soft" className="">
            Solicitar borrado de la cuenta
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>
          ¿Quiere que borremos la información de su cuenta?
        </Dialog.Title>
        <Dialog.Description size="3" mb="6">
          Si usted acepta el equipo de MuscleMate se encargará de eliminar todos
          sus datos de la plataforma. Una vez que borremos sus datos le
          confirmaremos su baja mediante correo electrónico.
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="center">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancelar
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Aceptar</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
