import Stripe from "stripe";

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY)

export function GetPricingPlans(){
    return stripe.products.list({
        active: true,
        expand: ['data.default_price'],
    });
}
