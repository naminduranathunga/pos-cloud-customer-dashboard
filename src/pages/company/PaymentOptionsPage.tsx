import AddStripePaymentMethod from "@/components/company/subscription/payments/StripeAddPaymentOption";
import { Button } from "@/components/ui/button";
import { CompanyDetails } from "@/interfaces/company";
import { CustomerUsageInvoice } from "@/interfaces/subscription/subscription_invoice";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";


interface PaymentMethodCard {
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}

export default function SubscriptionPaymentOptionsPage(){
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [cards, setCards] = useState<PaymentMethodCard[]|null>(null);
    const [autoPaymentStatus, setAutoPaymentStatus] = useState<boolean>(false);

    const { get_user_jwt, isLoading } = useFlexaroUser();

    const jwt = get_user_jwt();

    const onChangeAutoPayment = (status: boolean) => {
        if (!jwt) return;
        fetch(`${config.apiURL}/subscription-manager/auto-checkout/set-auto-payment-status`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({automaticPayment: status})
        }).then(res => res.json()).then(data => {
            setAutoPaymentStatus(data.automaticPayment);
        }).catch(err => {
            toast({
                title: "Failed to update auto payment status",
                description: err.message,
                variant: "destructive"
            })
        });
    }

    useEffect(() => {
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        fetch(`${config.apiURL}/subscription-manager/auto-checkout/get-stripe-payment-methods`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        }).then(res => res.json()).then(data => {
            setCards(data.paymentMethods);
        });

        fetch(`${config.apiURL}/subscription-manager/auto-checkout/get-auto-payment-status`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        }).then(res => res.json()).then(data => {
            setAutoPaymentStatus(data.automaticPayment);
        }).catch(err => {
            toast({
                title: "Failed to fetch payment options",
                description: err.message,
                variant: "destructive"
            })
        });
    }, [isLoading, get_user_jwt]);

    return (
        <div className={`bg-white shadow-md rounded-md p-4 md:px-8`} id="invoice">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl me-auto">Payment Options</h1>
            </header>

            <div className="my-6 flex">
                <div className="flex w-1/2 flex-col">
                    <h2 className="font-bold text-2xl mb-4">Automatic Payments</h2>
                    <p>By ennabling atomatic payments, the subscription fees will be automatically charged after week from invoice received.</p>
                    <div className="mt-4 flex gap-2">
                        <Switch checked={autoPaymentStatus} onCheckedChange={(e)=>{
                            setAutoPaymentStatus(e);
                            onChangeAutoPayment(e);
                        }}  /> 
                        <span>Automatic Payments Enabled</span>
                    </div>
                </div>


                <div className="flex flex-col w-1/2">
                    <h2 className="font-bold text-2xl mb-4">Credit Card</h2>
                    
                    <div className="mb-8 flex flex-col gap-4 w-f">
                        {cards && cards.map((card, index:number)=>
                        <div className="border rounded border-green-700 py-3 px-4 w-full flex items-center bg-green-50" key={index}>
                            <CreditCard size={32} className="me-4"/>
                            <div className="flex flex-col">
                                <div>{`**** **** **** ${card.last4}`}</div>
                                <div className="text-sm">Expires {card.exp_month}/{card.exp_year} | {card.brand}</div>
                            </div>
                            <button className="text-red-400 hover:underline ms-auto" type="button">Remove</button>
                        </div>)}

                        {!cards && <div className="border rounded border-gray-700 py-3 px-4 w-full flex items-center bg-white">
                            <Skeleton className="w-12 h-8" />
                            <div className="flex flex-col ms-2">
                                <div className="flex mb-2"><Skeleton className="w-52 h-4" /> </div>
                                <div className="text-sm flex gap-2"><Skeleton className="w-12 h-4" /> <Skeleton className="w-8 h-4" /></div>
                            </div>
                            <div className="ms-auto"><Skeleton className="w-8 h-4" /></div>
                        </div>}

                    </div>

                    {(showAddCardForm && jwt)? 
                        <AddStripePaymentMethod jwt={jwt} onClose={() => {setShowAddCardForm(false)}} />
                    : 
                    <div className="flex">
                        <Button onClick={() => {setShowAddCardForm(true)}}>Add Card</Button>
                    </div>}
                </div>
            </div>
        </div>
    )
}