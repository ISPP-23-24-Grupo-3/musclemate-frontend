import React from 'react'
import PricingButton from '../PricingButton/PricingButton'

function PricingCard({priceId, name, price ,features}) {
  return (
    <div className="bg-gray-800 rounded-3xl p-6">
      <h4 className="text-lg mb-2">{name}</h4>
      <h3 className="text-4xl font-semibold ">
        {price / 100}€<sub className="text-gray-300 text-sm ml-2">/ mes</sub>
      </h3>
      <hr className="mt-4" />
      <div className="mt-10">
        <ul className="space-y-4">
            {/* Features */}

            {features.map((feature, index) => (
                <li className="flex items-center text-sm" key={index}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  className="mr-4 bg-white fill-green-500 rounded-full p-[3px]"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                    data-original="#000000"
                  />
                </svg>
                {feature.name}
              </li>
            ))
                }
          
          {/* Features */}
          
        </ul>
        <PricingButton priceId={priceId} />
      </div>
    </div>
  );
}

export default PricingCard