import 'server-only'

import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)