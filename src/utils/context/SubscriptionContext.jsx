import React, { useContext, useState } from 'react'
import { createContext } from 'react'
import { getFromApi } from '../functions/api';
import AuthContext from './AuthContext';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY
const SubscriptionContext = createContext()

export default SubscriptionContext;

export function SubscriptionProvider( {children} ) {

    const stripe = new Stripe(STRIPE_SECRET_KEY)

    const {user} = useContext(AuthContext)

    const [ownerSubscription, setOwnerSubscription] = useState(() =>
    localStorage.getItem('ownerSubscription') ? JSON.parse(localStorage.getItem('ownerSubscription')) : [])
    const [gymnSubscription, setGymnSubscription] = useState(() =>
    localStorage.getItem('gymSubscription') ? JSON.parse(localStorage.getItem('gymSubscription')) : [])

    function saveGymnSubscription() {
        localStorage.setItem('gymSubscription', JSON.stringify(gymnSubscription));
    }

    const getOwnerSubscription = async () => {
        if (user.rol === 'owner') {
            const gyms = await getFromApi(`gyms/`)
            const gyms_list = await gyms.json()
            const gymSubscriptionStandard = gyms_list.some(gym => gym.subscription_plan === 'standard')
            const gymSubscriptionPremium = gyms_list.some(gym => gym.subscription_plan === 'premium')
            if (gymSubscriptionPremium) {
                await setOwnerSubscription({
                    owner_plan: "premium"})      
            } else if (gymSubscriptionStandard) {
                await setOwnerSubscription({
                    owner_plan: "standard"})   
            } else {
                await setOwnerSubscription({
                    owner_plan: "free"})   
            }        
        }
        localStorage.setItem('ownerSubscription', JSON.stringify(ownerSubscription));
    }
    

  
    return (
    <SubscriptionContext.Provider value={{gymnSubscription, setGymnSubscription, saveGymnSubscription, getOwnerSubscription, ownerSubscription}} >
        {children}
    </SubscriptionContext.Provider>
  )
}

