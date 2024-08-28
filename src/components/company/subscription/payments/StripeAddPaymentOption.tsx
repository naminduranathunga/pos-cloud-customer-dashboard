import {loadStripe, StripeElementsOptions} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import config from "@/lib/config";
import SetupForm from './StripeSetupForm';

const publishableKey = "pk_test_51PCmnvRwhVEyiTahbeScQ4RLR3nMRqPFsAx6j73hni88uIskVjxiLFxyvYZXm08DdUcnBBX5XR7Phjj1VZ9Mr1cI00FyBoXwY7";
const stripePromise = loadStripe(publishableKey);


export default function AddStripePaymentMethod({jwt, onClose}:{jwt: string, onClose: () => void}) {
    const [clientSectet, setClientSecret] = useState<string>("");


    useEffect(()=>{
        // fetch client secret
        fetch(`${config.apiURL}/subscription-manager/auto-checkout/add-stripe-payment-method`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).then(res => res.json()).then(data => {
            setClientSecret(data.client_secret);
        }).catch(err => {
            console.error(err);
        });
        // setClientSecret(clientSectet);
    }, [jwt]);

    // initilize stripe provider    
    const options: StripeElementsOptions = {
        clientSecret: clientSectet||undefined
    }

    return (
        <>
            {clientSectet ? <Elements stripe={stripePromise} options={options}>
                <SetupForm onCancel={onClose} />
            </Elements>
            : 
            <div>Loading...</div>
            }
        </>
    )
}