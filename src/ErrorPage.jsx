import { Box, Flex, Text } from "@radix-ui/themes";
import MainLayout from "./views/MainLayout/MainLayout";
import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <MainLayout>
      <Flex align="center" justify="center">
        <Box>
          {error.status === 404 && (
            <Text>
              La ruta que has especificado no se encuentra en ninguna parte.
              Comprueba que el enlace esta escrito correctamente
            </Text>
          )}
        </Box>
      </Flex>
    </MainLayout>
  );
}
