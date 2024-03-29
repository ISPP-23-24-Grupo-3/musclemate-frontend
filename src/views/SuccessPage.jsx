import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom';
import Stripe from 'stripe'
import { postToApi, putToApi } from '../utils/functions/api';
import SubscriptionContext from '../utils/context/SubscriptionContext';
import AuthContext from '../utils/context/AuthContext';

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY

function SuccessPage() {

    const {user} = useContext(AuthContext)
    const stripe = new Stripe(STRIPE_SECRET_KEY)
    const {gymnSubscription} = useContext(SubscriptionContext)
    const [searchParams, setSearchParams] = useSearchParams()


    async function updateGymSubscription() {
         const session = await stripe.checkout.sessions.retrieve(searchParams.get('session_id'))
         console.log(session.customer)
         const customer = await stripe.customers.retrieve(session.customer, {
            expand: ['subscriptions']
        })
        await putToApi(`owners/update/${user.user_id}/`, {
            "customer_id": customer.id
        })
        const gymsPromises = gymnSubscription.map(gym => {
            putToApi(`gyms/update/${gym.gym}/`, {
                "subscription_plan": gym.subscription_plan == "Estándar" ? "standard" : "premium"
            })
        })

        console.log("Gyms and Customer updated successfully")

        return Promise.all(gymsPromises)
    }

    useEffect(() => {
        updateGymSubscription()
    }, [])

    return (
        <Navigate to="/owner/home" />
    )
}
export default SuccessPage