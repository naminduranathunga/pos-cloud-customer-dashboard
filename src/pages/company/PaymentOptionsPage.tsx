import StripeCheckoutButton from "@/components/company/subscription/checkout/Stripecheckout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyDetails } from "@/interfaces/company";
import PayherePaymentFormInterface from "@/interfaces/subscription/payhere_payment_form_interface";
import { CustomerUsageInvoice } from "@/interfaces/subscription/subscription_invoice";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { CreditCard, Printer, X } from "lucide-react";
import { useEffect, useState } from "react";


function AddCreditCardForm({onCancel, onAddCard}: {onCancel: () => void, onAddCard: () => void}) {
    return (
        <form className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl mb-4">Add Credit Card</h2>
            <div className="flex flex-col">
                <label htmlFor="cardholder">Cardholder Name</label>
                <input type="text" id="cardholder" name="cardholder" className="border border-gray-300 rounded-md p-2"/>
            </div>
            <div className="flex flex-col">
                <label htmlFor="cardnumber">Card Number</label>
                <input type="text" id="cardnumber" name="cardnumber" className="border border-gray-300 rounded-md p-2"/>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="expdate">Expiration Date</label>
                    <input type="text" id="expdate" name="expdate" placeholder="MM/YY" className="border border-gray-300 rounded-md p-2"/>
                </div>
                <div className="flex flex-col w-1/2">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="XXX" className="border border-gray-300 rounded-md p-2"/>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button>Add Card</Button>
                <Button type="button" variant={"secondary"} onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    )
}
export default function SubscriptionPaymentOptionsPage(){
    const [invoice, setInvoice] = useState<CustomerUsageInvoice | null>(null);
    const [company, setCompany] = useState<CompanyDetails | null>(null);
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [printMode, setPrintMode] = useState(false);

    const { get_user_jwt, isLoading } = useFlexaroUser();

    return (
        <div className={`bg-white shadow-md rounded-md p-4 md:px-8 ${(printMode?" fixed inset-0 z-50":"")}`} id="invoice">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl me-auto">Payment Options</h1>
            </header>

            <div className="my-6 flex">
                <div className="flex w-1/2 flex-col">
                    <h2 className="font-bold text-2xl mb-4">Automatic Payments</h2>
                    <p>By ennabling atomatic payments, the subscription fees will be automatically charged after week from invoice received.</p>

                </div>


                <div className="flex flex-col w-1/2">
                    <h2 className="font-bold text-2xl mb-4">Credit Card</h2>
                    
                    <div className="border rounded border-green-700 py-3 px-4 w-full flex items-center bg-green-50 mb-8">
                        <CreditCard size={32} className="me-4"/>
                        <div className="flex flex-col">
                            <div>**** **** **** 4242</div>
                            <div className="text-sm">Expires 12/23 | Authorized</div>
                        </div>
                        <button className="text-red-400 hover:underline ms-auto" type="button">Remove</button>
                    </div>

                    {showAddCardForm ? 
                    <AddCreditCardForm onCancel={() => {setShowAddCardForm(false)}} onAddCard={() => {}}/>
                    : 
                    <div className="flex">
                        <Button onClick={() => {setShowAddCardForm(true)}}>Add Card</Button>
                    </div>}
                </div>
            </div>
        </div>
    )
}