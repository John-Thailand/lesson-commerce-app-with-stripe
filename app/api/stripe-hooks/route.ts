import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);
  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
  const signature = req.headers.get("stripe-signature");

  const reqBuffer = Buffer.from(await req.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature!, endpointSecret!);
    switch (event.type) {
      case "customer.subscription.created":
        break;
      case "customer.subscription.deleted":
        break;
      case "customer.subscription.updated":
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    return NextResponse.json(`Webhook Error: ${err.message}`, { status: 401 });
  }

  return NextResponse.json({ received: true })
};
