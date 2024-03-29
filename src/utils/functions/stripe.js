import Stripe from "stripe";

const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY)

export function GetPricingPlans(){
    return stripe.products.list({
        active: true,
        expand: ['data.default_price'],
    });
}

export async function CreateCheckoutSession(priceId, quantity = 1){
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: quantity,
            },
        ],
        mode: 'subscription',
        success_url: `${window.location.origin}/owner/success?session_id={CHECKOUT_SESSION_ID}&priceId=${priceId}`,
        cancel_url: `${window.location.origin}/owner/pricing`,
    });
    return JSON.stringify({url: session.url});
}
