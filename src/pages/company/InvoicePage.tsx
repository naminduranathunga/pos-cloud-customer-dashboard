import StripeCheckoutButton from "@/components/company/subscription/checkout/Stripecheckout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyDetails } from "@/interfaces/company";
import { CustomerUsageInvoice } from "@/interfaces/subscription/subscription_invoice";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Printer, X } from "lucide-react";
import { useEffect, useState } from "react";

async function get_subscription_details(jwt:string, id:string){
    //subscription-manager/get-invoices?company_id=
    const reqest2 = await fetch(`${config.apiURL}/subscription-manager/get-invoices?invoiceId=${id}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });

    if (reqest2.status === 401) {
        throw new Error("Unauthorized");
    }
    const invoices = await reqest2.json();
    if (invoices.invoices.length === 0) {
        return null;
    }
    
    const reqest3 = await fetch(`${config.apiURL}/company-manager/get-company-profile`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (reqest3.status === 401) {
        throw new Error("Unauthorized");
    }
    const company = (await reqest3.json()) as CompanyDetails; 

    return {invoice_:invoices.invoices[0], company:company as CompanyDetails};
}

const get_formatted_date = (date:string)=>{
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const get_formatted_currency = (amount:number)=>{
    return `Rs. ${amount}/-`;
}

const CompanyAddressComponent = ({company}:{company:CompanyDetails})=>{
    const address = company.address.split(",");
    return <>
        <p key={2000}>{company.name}</p>
        {
            address.map((line, index)=>{
                return <p key={index}>{line}</p>
            })
        }
        <p key={2001}>{company.email}</p>
        <p key={2002}>{company.phone}</p>
    </>

}

function PrintElem(elem:any)
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    if (!mywindow) {
        return false;
    }

    // get stylesheets
    
    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(elem.innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.head.innerHTML = document.head.innerHTML;

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}


export default function SubscriptionInvoicePage(){
    const [invoice, setInvoice] = useState<CustomerUsageInvoice | null>(null);
    const [company, setCompany] = useState<CompanyDetails | null>(null);
    const [printMode, setPrintMode] = useState(false);

    const { get_user_jwt, isLoading } = useFlexaroUser();

    const onClickPrint = ()=>{
        PrintElem(document.getElementById("invoice"));
        /*if (printMode) {
            setPrintMode(false);
        } else {
            setPrintMode(true);
            setTimeout(()=>{
                window.print();
            }, 500);
        }*/
    }


    useEffect(() => {
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;
        const _id = window.location.pathname.split("/").pop() as string;
        get_subscription_details(jwt, _id).then((data)=>{
            setInvoice(data?.invoice_);
            if (data?.company)
                setCompany(data?.company);
        }).catch((err)=>{
            console.error(err);

        })
    }, [isLoading, get_user_jwt])

    let total = 0;
    let totalAfterTax = 0;
    if (invoice) {
        total = invoice.totalAmount;
        totalAfterTax = total + (invoice.taxAmount||0);
    }
    return (
        <div className={`bg-white shadow-md rounded-md p-4 md:px-8 ${(printMode?" fixed inset-0 z-50":"")}`} id="invoice">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl me-auto">Invoice No: {invoice?.invoiceNumber||""}</h1>

                {
                    invoice && !invoice.isPaid && <StripeCheckoutButton invoice_id={invoice._id as string}/>
                }
                <Button onClick={onClickPrint} variant={"secondary"}>
                    {printMode?<X size={20}/>:<Printer size={20}/>}
                </Button>
            </header>


            {invoice && <div className="w-full mt-8">
                <div className="flex items-start w-full">
                    <div className="w-1/2 flex flex-col items-start">
                        <img src="http://localhost:3000/assets/images/invoice-logo-black.png" alt="logo" className="h-10 md:h-14 w-auto object-contain mb-4" />
                        <h2 className="font-bold text-4xl">Invoice</h2>
                        {
                            invoice.isPaid ? <span className="text-green-500 text-xl font-semibold">Paid</span>
                            :<span className="text-yellow-500 text-xl font-semibold">Unpaid</span>
                        }
                    </div>
                    <div className="w-1/2 flex flex-col items-end text-end">
                        <address>
                            <p className="font-bold text-lg">ABC Co. (Pvt) Ltd.</p>
                            <p>Sample AAA Rd.</p>
                            <p>(+94) 11353322</p>
                            <p>info@flexaro.net</p>
                        </address>
                    </div>
                </div>
                <div className="flex items-start w-full mt-4 border-y py-4">
                    <div className="w-1/2 flex justify-start flex-col items-start">
                        <table className="">
                            <tbody>
                                <tr>
                                    <td className="py-1 ps-4">Invoice No.</td>
                                    <td className="py-1 ps-4">{invoice.invoiceNumber||""}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 ps-4">Invoice Date:</td>
                                    <td className="py-1 ps-4">{get_formatted_date(invoice.invoiceDate)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 ps-4">Invoice Due: </td>
                                    <td className="py-1 ps-4">{get_formatted_date(invoice.dueDate)}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 ps-4">Total:</td>
                                    <td className="py-1 ps-4">{`Rs. ${invoice.totalAmount}/-`}</td>
                                </tr>
                                {
                                    invoice.isPaid &&<>
                                    <tr>
                                        <td className="py-1 ps-4">Payment Date:</td>
                                        <td className="py-1 ps-4">{get_formatted_date(invoice.paymentDate||"")}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 ps-4">Payment Method:</td>
                                        <td className="py-1 ps-4">{invoice.paymentMethod}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 ps-4">Paid Amount:</td>
                                        <td className="py-1 ps-4">{get_formatted_currency(invoice.paidAmount)}</td>
                                    </tr>
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/2 flex flex-col text-end">
                        <h3 className="font-bold text-lg">Billed To:</h3>
                        <address>
                            {
                                company && <CompanyAddressComponent company={company}/>
                            }
                        </address>
                    </div>
                </div>
                <Table className="my-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead className="w-fullx">Service/Product</TableHead>
                            <TableHead className="text-end">Unit Price</TableHead>
                            <TableHead className="text-end">Qty</TableHead>
                            <TableHead className="text-end">Amount</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            (invoice.invoiceItems as Array<any>).map((item, index)=>{
                                return <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-end">{get_formatted_currency(item.unitPrice)}</TableCell>
                                    <TableCell className="text-end">{item.quantity}</TableCell>
                                    <TableCell className="text-end">{get_formatted_currency(item.total)}</TableCell>
                                </TableRow>
                            })
                        }
                        <TableRow>
                            <TableHead className="text-end" colSpan={4}>Sub Total</TableHead>
                            <TableCell className="text-end">{get_formatted_currency(total)}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                            <TableHead className="text-end" colSpan={4}>Tax</TableHead>
                            <TableCell className="text-end">{invoice.taxAmount?get_formatted_currency(invoice.taxAmount):"N/A"}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                            <TableHead className="text-lg text-end" colSpan={4}>Total</TableHead>
                            <TableCell className="text-lg font-semibold text-end">{get_formatted_currency(totalAfterTax)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {
                    !invoice.isPaid && <div className="flex items-center justify-center w-full py-8">
                        <StripeCheckoutButton invoice_id={invoice._id as string}/>
                    </div>
                }
            </div>}
        </div>
    )
}