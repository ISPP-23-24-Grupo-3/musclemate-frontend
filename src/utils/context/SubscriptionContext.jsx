import React, { useState } from 'react'
import { createContext } from 'react'

const SubscriptionContext = createContext()

export default SubscriptionContext;

export function SubscriptionProvider( {children} ) {

    const [gymnSubscription, setGymnSubscription] = useState(() =>
    localStorage.getItem('gymSubscription') ? JSON.parse(localStorage.getItem('gymSubscription')) : [])

    function saveGymnSubscription() {
        localStorage.setItem('gymSubscription', JSON.stringify(gymnSubscription));
    }

    

  
    return (
    <SubscriptionContext.Provider value={{gymnSubscription, setGymnSubscription, saveGymnSubscription}} >
        {children}
    </SubscriptionContext.Provider>
  )
}

