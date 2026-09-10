import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Critical Failure: STRIPE_SECRET_KEY environment variable is missing.",
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: "Night Owl E-Commerce",
    version: "0.1.0",
  },
});
