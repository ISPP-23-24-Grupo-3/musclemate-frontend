import React from 'react'

function PricingButton({priceId}) {
    function handleClick() {
        console.log(priceId)
      }
  return (
    <button type="button" className="w-full mt-10 px-2 py-2 text-sm  border hover:border-orange-500 bg-transparent rounded-xl" onClick={handleClick}>Get Started</button>
  )
}

export default PricingButton