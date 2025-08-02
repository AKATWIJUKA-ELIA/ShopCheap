import { NextResponse } from 'next/server';
import  Stripe  from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY??"", {
  apiVersion: '2025-03-31.basil',
});

export async function POST() {
  try {
        const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                ui_mode: 'custom',
                line_items: [
                {
                price_data: {
                        currency: 'usd',
                        product_data: {
                        name: 'Sample Product',
                        },
                        unit_amount: 2000, // $20.00
                },
                quantity: 1,
                },
                ],
                return_url: 'https://example.com/return?session_id={CHECKOUT_SESSION_ID}'
        });
    return NextResponse.json({checkoutSessionClientSecret:session.client_secret},);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ message: 'Internal Server Error',  status: 500 });
  }
}