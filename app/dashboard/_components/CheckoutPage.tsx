import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import { useEffect, useState, FormEvent, useContext } from "react";
import { X } from "lucide-react";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import moment from "moment";

export interface PROP {
  amount: number;
  name?: any;
  email?: any;
}

const CheckoutPage = ({ amount, name, email }: PROP) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  );

  const { user } = useUser();

  useEffect(() => {
    const createSubscription = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: convertToSubcurrency(amount),
            name,
            email,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create subscription");
        }

        const data = await response.json();

        if (data && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("No client secret in response");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    createSubscription();
  }, [amount, name, email]);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError }: any = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:3000/dashboard/billing",
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent) {
      await SaveSubscription(paymentIntent.id);
      setShowSuccessAlert(true);
      setIsOpen(false);
    }

    setLoading(false);
  };

  const SaveSubscription = async (paymentId: string) => {
    const result = await db.insert(UserSubscription).values({
      email: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      active: true,
      paymentId: paymentId,
      joinDate: moment().format("DD/MM/YYYY"),
    });

    console.log(result);
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    window.location.reload();
  };

  return (
    <div>
      <button
        onClick={toggleDialog}
        className={`w-full text-blue-800 font-medium border-2 border-gray-300 rounded-full text-center mt-8 p-2 ${
          userSubscription && "cursor-not-allowed"
        }`}
        disabled={!!userSubscription}
      >
        {userSubscription ? "Currently Active Plan" : "Get Started"}
      </button>

      <form onSubmit={handleSubmitPayment} id="payment-form">
        {clientSecret && isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative m-8">
              <X
                onClick={toggleDialog}
                className="absolute top-3 right-3 cursor-pointer"
              />
              <div>
                <h2 className="text-lg font-semibold text-center my-4 flex flex-col">
                  <span>Monthly Subscription Plan</span>
                  <span>Has requested ${amount}</span>
                </h2>
                <PaymentElement />
                {errorMessage && (
                  <div className="text-center mt-2 text-red-500">
                    {errorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-blue-800 w-full mt-5 text-white px-4 py-2 rounded-md shadow-lg"
                  disabled={loading || !stripe || !elements}
                  id="submit"
                >
                  {loading ? "Processing..." : `Pay $${amount}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Success alert modal */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-14 max-w-sm w-full m-10">
            <h3 className="text-xl font-bold text-center">
              Subscription Successful!
            </h3>
            <button
              onClick={closeSuccessAlert}
              className="bg-blue-800 text-white w-full mt-6 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
