import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { updatePayments } from '@/lib/db';
import { HomeButton } from '../../components/HomeButton';

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  // Extract payment session_id
  const { session_id } = await searchParams;

  if (!session_id || Array.isArray(session_id))
    return (
      <section id='failure'>
        <p>Invalid session ID.</p>
      </section>
    );

  // Retrieve the session from Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent'],
    });
  } catch (error) {
    return (
      <section id='failure'>
        <p>
          {typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'An error occurred.'}
        </p>
      </section>
    );
  }

  const { status, customer_details, amount_total, created, line_items } =
    session;

  const customerEmail = customer_details?.email;

  // Check payment status
  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    // Create payment data object
    const paymentData = {
      amount_total: amount_total?.toString() || '0',
      createdAt: new Date(created * 1000),
      productPriceId: line_items?.data[0]?.price?.id || '',
      userEmail: customerEmail || '',
    };

    try {
      await updatePayments(paymentData); // Update payment records in the database
    } catch (error) {
      return (
        <section id='failure'>
          <p>
            {typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : 'An error occurred.'}
          </p>
          <HomeButton />
        </section>
      );
    }

    return (
      <section id='success'>
        <p>
          We appreciate your purchase! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
          <a href='mailto:info@cihadcengiz.com'>info@cihadcengiz.com</a>.
        </p>

        <HomeButton />
      </section>
    );
  }
}
