import React, { useEffect, useState } from 'react'
import { GetPricingPlans } from '../../utils/functions/stripe'
import PricingButton from '../../components/PricingButton/PricingButton'
import PricingCard from '../../components/PricingCard/PricingCard'
import { Heading } from '@radix-ui/themes'



function PricingPage() {
    const [plans, setPlans] = useState([])
    
    useEffect(() => {

        GetPricingPlans().then((plans) => {
            setPlans(plans.data.slice(0, 2))
        })

        
    }, [])

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center text-[#333]">
          <Heading size="8" className="text-radixgreen !mt-8 !mb-3 text-center">Planes de subscripción</Heading>
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-2 gap-8 mt-12 max-sm:max-w-sm max-sm:mx-auto">
            {plans.map((plan, index) => {
                 if(index === 0) {
                     return (<PricingCard key={plan.id} priceId={plan.default_price.id} name={plan.name} price={plan.default_price.unit_amount} features={plan.features} background={"light"}/>)
                 } else {
                     return  (<PricingCard key={plan.id} priceId={plan.default_price.id} name={plan.name} price={plan.default_price.unit_amount} features={plan.features} background={"dark"}/>)
                 }
             })}
        </div>
      </div>
    </div>
  )
}

export default PricingPage