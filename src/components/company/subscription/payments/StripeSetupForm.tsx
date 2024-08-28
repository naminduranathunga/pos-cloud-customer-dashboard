import React, { useState } from 'react';
import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

const SetupForm = ({onCancel}:{onCancel:()=>void}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event:any) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        if (loading) return;

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return null;
        }
        setLoading(true);

        const {error} = await stripe.confirmSetup({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: 'https://example.com/account/payments/setup-complete',
            },
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error.message as string);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            // onCancel();
            setErrorMessage("Done");    
        }
        setLoading(false);
    };
    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <div className="flex items-center gap-4 mt-4">
                <Button type='submit' disabled={loading}>Add Card</Button>
                <Button type="button" variant={"secondary"} onClick={onCancel}>Cancel</Button>
            </div>
            {errorMessage && <div className='text-red-500 mt-4'>{errorMessage}</div>}
        </form>
    );
};

export default SetupForm;