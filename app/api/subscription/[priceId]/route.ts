import { createServerClient } from "@supabase/ssr/dist/main/createServerClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe";

export async function GET(
  req: NextRequest,
  { params }: { params: { priceId: string } }
) {
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
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const { data: stripe_customer_data } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user?.id)
    .single();

  const priceId = params.priceId;
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer_data?.stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancelled",
  });

  return NextResponse.json({ id: session.id });
}
