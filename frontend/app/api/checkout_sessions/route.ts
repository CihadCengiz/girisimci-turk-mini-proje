import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const productPriceId = formData.get("productPriceId") as string | null;

        if (!productPriceId) {
            return NextResponse.json(
                { error: 'Product price ID is required.' },
                { status: 400 }
            );
        }

        const headersList = await headers();
        const origin = headersList.get('origin');

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: productPriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        });
        if (session.url) {
            return NextResponse.redirect(session.url, 303);
        } else {
            return NextResponse.json(
                { error: 'Session URL is null.' },
                { status: 500 }
            );
        }
    } catch (err: unknown) {
        let message = 'An unknown error occurred.';
        let statusCode = 500;
        if (err && typeof err === 'object' && 'message' in err) {
            message = (err as { message: string; }).message;
        }
        if (err && typeof err === 'object' && 'statusCode' in err) {
            statusCode = (err as { statusCode: number; }).statusCode || 500;
        }
        console.error(err);
        return NextResponse.json(
            { error: message },
            { status: statusCode }
        );
    }
}