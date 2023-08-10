// import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
// import { PaymentElement } from "@stripe/react-stripe-js";


export default function CheckoutForm({}) {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!stripe || !elements) return

    setIsProcessing(true)

    const {error} = await stripe.confirmPayment({
        elements,
        confirmParams:{
            return_url: `${window.location.origin}`
        },
    });

    if (error) {setMessage(error.message)}
    else if (paymentIntent && paymentIntent.status === 'succeeded') {setMessage("Payment status: " + paymentIntent.status)}
    else {setMessage("Unexpected State")}

    setIsProcessing(false)
  };

  return (
      <form className="payment-form" onSubmit={handleSubmit}>
        <PaymentElement/>
        <button disabled={isProcessing} id="submit">
          <span>{isProcessing ? "Processing..." : "Pay Now"}</span>
        </button>

        {message && <div id="payment-message">{message}</div>}
      </form>

  );
}
