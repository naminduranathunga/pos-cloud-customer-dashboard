import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CustomerUsageInvoice } from "@/interfaces/subscription/subscription_invoice";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


async function get_subscription_details(jwt:string){
    const response = await fetch(`${config.apiURL}/subscription-manager/get-subscription`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (response.status === 401) {
        throw new Error("Unauthorized");
    }
    const subscription = await response.json();

    //subscription-manager/get-invoices?company_id=
    const reqest2 = await fetch(`${config.apiURL}/subscription-manager/get-invoices`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (reqest2.status === 401) {
        throw new Error("Unauthorized");
    }
    const invoices = await reqest2.json();
    return {subscription: subscription.subscription, invoices: invoices.invoices};
}
const get_formatted_date = (date:string)=>{
    const d = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const get_formatted_currency = (amount:number)=>{
    return `Rs. ${amount}/-`;
}

export default function SubscriptionPage(){
    const [subscription, setSubscription] = useState<any | null>(null);
    const [invoices, setInvoices] = useState<Array<any> | null>(null);
    const { get_user_jwt, isLoading } = useFlexaroUser();

    const { toast } = useToast();

    useEffect(()=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        get_subscription_details(jwt).then(
            (data) => {
                setSubscription(data.subscription);
                setInvoices(data.invoices);
            }
        ).catch(
            (err) => {
                console.error(err);
                toast({
                    title: "Error",
                    description: "Failed to fetch company details",
                    variant: "destructive"
                });
            }
        )
    }, [get_user_jwt, isLoading, toast]);

    

    const getDateFormatted = (date:string) => {
        let d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    }


    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">Subscription Details</h1>
            </header>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                {subscription && <table className="w-full">
                    <tbody>
                        <tr>
                            <td>Name:</td>
                            <td>{subscription.packageName}</td>
                        </tr>
                        
                        <tr>
                            <td>Price:</td>
                            <td>Rs. {subscription.packagePrice}/{(subscription.reccuringTime == "monthly")?"mo":"yr"} - ({subscription.reccuringTime})</td>
                        </tr>
                        
                        <tr>
                            <td>Valid Till:</td>
                            <td>{getDateFormatted(subscription.packageExpires)}</td>
                        </tr>
                        
                        <tr>
                            <td>Name:</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>}
            </div>

            <div className="w-full mt-8">
                <h2 className="mb-4 font-bold text-2xl">Invoices</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice No.</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Due</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {invoices && invoices.map((invoice:CustomerUsageInvoice)=><TableRow>
                            <TableCell>{invoice.invoiceNumber}</TableCell>
                            <TableCell>{get_formatted_date(invoice.invoiceDate)}</TableCell>
                            <TableCell>
                                {
                                    invoice.isPaid ? <span className="text-green-500 font-semibold">Paid</span>
                                    :<span className="text-yellow-500 font-semibold">Unpaid</span>
                                }
                            </TableCell>
                            <TableCell>{ get_formatted_currency(invoice.totalAmount) }</TableCell>
                            <TableCell>
                                <div className="flex gap-2 items-center">
                                    <Link to={`/company/subscriptions/invoice/${invoice._id}`}><Button variant={"link"} >View</Button></Link>
                                </div>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}