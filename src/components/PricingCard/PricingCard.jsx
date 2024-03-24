import React from 'react'
import PricingButton from '../PricingButton/PricingButton'
import { Heading } from '@radix-ui/themes';

function PricingCard({priceId, name, price ,features, background = "light"}) {
  return (
    <div className={`${background === "light" ? "bg-[#E6F6EB] text-[#333]" :"bg-radixgreen text-white" } rounded-xl relative overflow-hidden transition-all`}>
            <div className="p-6">
              <div className="text-left flex flex-col gap-2">
                <Heading size="4">{name}</Heading>
                <div>
                    <Heading size="8">{price / 100}€<span className="text-sm "> / mes</span></Heading>
                </div>
              </div>
              <div className="">
              {
              background === "light" ? <PricingButton priceId={priceId} /> : <PricingButton priceId={priceId} background={"dark"} />
              }
                <ul className="space-y-4">
                  {/* Features */}

            {features.map((feature, index) => (
                <li className="flex items-center text-sm" key={index}>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-4 bg-gray-200 fill-[#333] rounded-full p-[3px]" viewBox="0 0 24 24">
                  <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                </svg>
                {feature.name}
              </li>
            ))
                }
          
          {/* Features */}
                </ul>
              </div>
            </div>
          </div>
  );
}

export default PricingCard