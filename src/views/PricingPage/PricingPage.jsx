import React, { useEffect, useState } from 'react'
import { GetPricingPlans } from '../../utils/functions/stripe'
import PricingButton from '../../components/PricingButton/PricingButton'
import PricingCard from '../../components/PricingCard/PricingCard'



function PricingPage() {
    const [plans, setPlans] = useState([])
    
    useEffect(() => {
        GetPricingPlans().then((plans) => {
            console.log(plans.data.slice(0, 2))
            setPlans(plans.data.slice(0, 2))
        })
    }, [])

  return (
    <div className="font-[sans-serif] text-white m-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#333]">Elige una Subscripción</h2>
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-12 max-sm:max-w-sm max-sm:mx-auto">
            {plans.map((plan, index) => (
                <PricingCard key={plan.id} priceId={plan.default_price.id} name={plan.name} price={plan.default_price.unit_amount} features={plan.features} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default PricingPage