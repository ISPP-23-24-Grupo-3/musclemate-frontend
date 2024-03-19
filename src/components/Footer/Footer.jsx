import { Flex } from "@radix-ui/themes";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 py-6 px-16 font-[sans-serif]">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <Flex align="center">
          <img src="/pwa-64x64.png" alt="Logo" className="mr-4 mb-4 sm:mb-0" />
          <h1 className="text-xl font-bold">MuscleMate</h1>
        </Flex>
        <ul className="flex max-sm:flex-col gap-x-6 gap-y-2">
          <li>
            <a
              href="javascript:void(0)"
              className="hover:text-gray-600 text-black text-base transition-all"
            >
              Términos y Condiciones
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              className="hover:text-gray-600 text-black text-base transition-all"
            >
              Política de Privacidad
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              className="hover:text-gray-600 text-black text-base transition-all"
            >
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
