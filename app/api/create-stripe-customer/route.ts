import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async getAll() {
            return (await cookieStore).getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(async ({ name, value, options }) => {
              (await cookieStore).set(name, value, options);
            });
          },
        },
      }
  )
  const data = await req.json();
  const { id, email } = data;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create({
    email,
  });

  const { error } = await supabase.from("profile").update({
    stripe_customer: customer.id,
  }).eq("id", id)
  console.log(id, customer.id)
  console.log(error)

  return NextResponse.json({
    message: `stripe customer created: ${customer.id}`,
  });
}
