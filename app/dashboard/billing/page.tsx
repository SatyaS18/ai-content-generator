"use client";

import { Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import { useUser } from "@clerk/nextjs";
import { useContext } from "react";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import CheckoutPage from "../components/CheckoutPage";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_public_key"
);

const Billing = () => {
  const { user } = useUser();

  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  );

  const amount = 9.99;

  return (
    <div className="h-screen">
      <h2 className="text-center mt-10 font-bold text-2xl">
        Upgrade With Monthly Plan
      </h2>
      <div className="flex flex-col md:flex-row gap-5 justify-center my-5">
        {/* free section */}
        <div className="bg-white rounded-lg p-8 mx-4 md:mb-0 shadow-lg">
          <p className="text-center font-bold text-lg">Free</p>
          <p className="text-center my-4 font-bold">
            <span className="text-2xl">0$</span> /month
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />
            10,000 Words/Month
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />
            50+ Content Templates
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />
            Unlimited Download & Copy
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />1 Month of History
          </p>
          {!userSubscription && (
            <p className="bg-green-500 text-white rounded-full text-center mt-8 p-2.5">
              Currently Active Plan
            </p>
          )}
        </div>
        {/* monthly section */}
        <div className="bg-white rounded-lg p-8 mx-4 md:mb-0 shadow-lg">
          <p className="text-center font-bold text-lg">Monthly</p>
          <p className="text-center my-4 font-bold">
            <span className="text-2xl">9.99$</span> /month
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />
            1,00,000 Words/Month
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />
            50+ Template Access
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />
            Unlimited Download & Copy
          </p>
          <p className="flex gap-2 font-semibold my-1">
            <Check />1 Year of History
          </p>
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount),
              currency: "usd",
            }}
          >
            <CheckoutPage
              amount={amount}
              name={user?.fullName}
              email={user?.primaryEmailAddress?.emailAddress}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Billing;
