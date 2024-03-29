import { Button } from '@radix-ui/themes'
import React from 'react'
import { CreateCheckoutSession } from '../../utils/functions/stripe'
import { Link } from 'react-router-dom';

function PricingButton({subscription_plan,priceId, background = "light"}) {


    
      function handleClick() {
        CreateCheckoutSession(priceId).then((session) => {
          window.location.href = JSON.parse(session).url;
            
        });
        
      }
  return (
    <div className='mt-4 mb-4'>
      {background === "light" ? 
      <Link to="../subscriptions" state={{priceId, subscription_plan}}>
      <Button type="button" size="3" className="w-full">Elegir plan</Button>
      </Link>
      :
      <Link to="../subscriptions" state={{priceId, subscription_plan}}> 
      <Button type="button" variant="surface" size="3" className="w-full">Elegir plan</Button>
      </Link>
      }
    </div>
  )
}

export default PricingButton