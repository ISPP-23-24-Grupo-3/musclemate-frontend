import { Button, Flex } from "@radix-ui/themes";

const Header = () => {
  return (
    <header className="flex items-center justify-between h-20 border-b-2 border-black">
      <Flex align="center" m="4">
        <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
        <h1 className="text-xl font-bold">MuscleMate</h1>
      </Flex>
      <div className="m-4 flex gap-3 items-center">
        <Button size="2" variant="solid" color="green">Entrar</Button>
        <Button size="2" variant="surface" color="green">Registrarse</Button>
      </div>
    </header>
  );
};

export default Header;
