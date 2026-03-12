import { createServerClient } from "@supabase/ssr/dist/main/createServerClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe";

export async function GET(req: NextRequest) {
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

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_data?.stripe_customer,
    return_url: `http://localhost:3000/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
