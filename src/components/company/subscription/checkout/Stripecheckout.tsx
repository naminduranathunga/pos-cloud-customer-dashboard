import { Button } from "@/components/ui/button";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { redirect } from "react-router-dom";


export default function StripeCheckoutButton({invoice_id}: {invoice_id:string}){
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { get_user_jwt,isLoading } = useFlexaroUser();
    const handleStripeCheckout = async ()=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;
        setIsRedirecting(true);

        const thisUrl = encodeURI(window.location.href);

        fetch(`${config.apiURL}/subscription-manager/checkout/create-stripe-session?invoice_id=${invoice_id}&url=${thisUrl}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).then((response)=>response.json()).then((data)=>{
            const url = data.url;
            window.location.href = url;
        }).catch((err)=>{
            console.error(err);
        }).finally(()=>{
            setIsRedirecting(false);
        })
    }
    return (
        <div>
            <Button onClick={handleStripeCheckout} disabled={isRedirecting} className="flex items-center gap-1">
                <span>Pay Now</span>
                {isRedirecting && <Loader2 size={"1em"} className="animate-spin" />}
            </Button>
        </div>
    )
}