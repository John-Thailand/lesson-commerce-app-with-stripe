import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import initStripe from "stripe";

const getAllPlans = async () => {
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);
  const { data: plansList } = await stripe.plans.list();
  const plans = await Promise.all(plansList.map(async (plan) => {
    const product = await stripe.products.retrieve(plan.product as string);
    return {
      id: plan.id,
      name: product.name,
      price: plan.amount_decimal,
      interval: plan.interval,
      currency: plan.currency,
    }
  }))
  return plans;
};

const PricingPage = async () => {
  const plans = await getAllPlans();

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        // eslint-disable-next-line react/jsx-key
        <Card>
          <CardHeader>
            <CardTitle>{plan.name}プラン</CardTitle>
            <CardDescription>{plan.name}</CardDescription>
          </CardHeader>
          <CardContent>{plan.price}円 / {plan.interval}</CardContent>
          <CardFooter>
            <Button>サブスクリプション契約する</Button>
          </CardFooter>
        </Card>
      ))}
      <Card>
        <CardHeader>
          <CardTitle>年額プラン</CardTitle>
          <CardDescription>Annual</CardDescription>
        </CardHeader>
        <CardContent>20000円 / 年</CardContent>
        <CardFooter>
          <Button>サブスクリプション契約する</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
