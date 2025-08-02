"use client";
import React from 'react';
import {
        // useCheckout
        PaymentElement} from '@stripe/react-stripe-js';
import PayButton from '../PayButton/PayButton';
import EmailInput from '../EmailInput/EmailInput';

const CheckoutForm = () => {
//   const checkout = useCheckout();
  return (
    <pre>
        <form>
        <EmailInput />
      <PaymentElement options={{layout: 'accordion'}}/>
        <PayButton />

    </form>
    
      {/* {JSON.stringify(checkout.lineItems, null, 2)}
      // A formatted total amount
      Total: {checkout.total.total.amount} */}
    </pre>
  )
};
export default CheckoutForm;