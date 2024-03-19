import { Button } from '@radix-ui/themes'
import React from 'react'
import { CreateCheckoutSession } from '../../utils/functions/stripe'

function PricingButton({priceId, background = "light"}) {


    
      function handleClick() {
        CreateCheckoutSession(priceId).then((session) => {
          window.location.href = JSON.parse(session).url;
            
        });
        
      }
  return (
    <div className='mt-4 mb-4'>
      {background === "light" ? <Button type="button" size="3" className="w-full" onClick={handleClick}>Elegir plan</Button> : <Button type="button" variant="surface" size="3" className="w-full" onClick={handleClick}>Elegir plan</Button>}
    </div>
  )
}

export default PricingButton