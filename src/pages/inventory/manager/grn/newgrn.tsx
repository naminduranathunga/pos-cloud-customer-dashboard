import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader, Loader2, Save } from "lucide-react";
import GRNProductTable from "@/components/inventory/inventory_manager/grn_product_table";
import { useEffect, useState } from "react";
import { GRNSingle, GRNProduct, Vendor } from "@/interfaces/inventory/grn";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { get_next_grn_number } from "./functions";
import { useToast } from "@/components/ui/use-toast";
import get_selected_branch from "@/lib/get_selected_branch";
import { CompanyBranch } from "@/interfaces/company";
import VendorSelector from "@/components/inventory/inventory_manager/vendor_selector";

const sample_products:GRNProduct[] = [
    {
        id: 1,
        product: {
            id: "1",
            name: "Product 1"
        },
        cost_price: 100,
        sales_price: 120,
        quantity: 10
    },
    {
        id: 2,
        product: {
            id: "2",
            name: "Product 2"
        },
        cost_price: 200,
        sales_price: 220,
        quantity: 20
    },
    {
        id: 3,
        product: {
            id: "3",
            name: "Product 3"
        },
        cost_price: 300,
        sales_price: 320,
        quantity: 30
    },
]

function get_formatted_date(){
    //2024-06-07
    const date = new Date();
    let mm:any = date.getMonth() + 1;
    if (mm < 10){
        mm = `0${mm}`;
    }
    let dd:any = date.getDate();
    if (dd < 10){
        dd = `0${dd}`;
    }
    
    return `${date.getFullYear()}-${mm}-${dd}`
}
function createNewGRN(){
    // Create new GRN
    return {
        grn_number: -1,
        vendor: {
            id: -1,
            name: "",
        } as Vendor,
        date: get_formatted_date(),
        invoice_no: "",
        status: "draft",
        products: sample_products,
        attachments: [],
        branch: "",
        invoice_value: 0,
        total: "",
        adjusted_total: 0,
        notes: ""
    } as unknown as GRNSingle;
}

export default function CreateNewGRNPage(){
    const [grn, setGRN] = useState<GRNSingle>(createNewGRN());
    const [grnProductList, setGRNProductList] = useState<GRNProduct[]>(sample_products);
    const [loadingGRNno, setLoadingGRNno] = useState(false);
    const {isLoading, get_user_jwt} = useFlexaroUser();
    const [invoice_value, setInvoiceValue] = useState("0");
    const {toast} = useToast();

    useEffect(()=>{
        if (isLoading) return;
        if (loadingGRNno) return;
        if (grn.grn_number != -1) return;

        setLoadingGRNno(true);
        const jwt = get_user_jwt();
        if (!jwt){
            document.dispatchEvent(new Event("flexaro_user_unauthorized"));
            return;
        }

        const branch = get_selected_branch() as CompanyBranch|null;
        if (!branch){
            return;
        }

        get_next_grn_number(branch._id, jwt).then((grn_number:string)=>{
            setGRN({...grn, grn_number:grn_number});
            setLoadingGRNno(false);
        }).catch(()=>{
            // handle errors
            toast({
                title:"Error",
                description: "An error occured while getting GRN number. Please try again later.",
                variant: "destructive"
            })
        })
    }, [isLoading, loadingGRNno, grn, get_user_jwt])

    console.log(grn.date);
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">New Good Received Note</h1>

                <Button className="flex items-center gap-2 ms-auto" > <Save size={"1em"} /> Save</Button>
            </header>


            <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_no" className="text-nowrap">GRN No.:</Label>
                        <div className="flex items-center gap-2">
                            <Input id="grn_no" value={grn.grn_number} disabled/>
                            {loadingGRNno && <Loader2 size={"1em"} className="animate-spin" />}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_date" className="text-nowrap">Date:</Label>
                        <Input id="grn_date" type="date" value={grn.date} onChange={(e)=>{
                            setGRN({ ...grn, date: e.target.value } as GRNSingle)
                            console.log(e.target.value)
                        }}/>
                    </div>

                </div>

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_invoice_no" className="text-nowrap">Invoce No.:</Label>
                        <Input id="grn_invoice_no" type="text" value={grn.invoice_no} onChange={(e)=>{
                            setGRN({ ...grn, invoice_no: e.target.value } as GRNSingle)
                        }}/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_invoice_value" className="text-nowrap">Invoce Value:</Label>
                        <Input id="grn_invoice_value" type="text" value={invoice_value} onChange={(e)=>{setInvoiceValue(e.target.value)}}/>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_vendor" className="text-nowrap">Vendor:</Label>
                        <VendorSelector vendor={grn.vendor} onChange={(venodr)=>{setGRN({...grn, vendor: venodr} as GRNSingle)}}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_ex_notes" className="text-nowrap">Notes:</Label>
                        <textarea className="w-full border rounded" rows={4}></textarea>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-1 gap-6">
                <GRNProductTable data={grn.products} onChange={(plist:GRNProduct[])=>{setGRN({
                    ...grn,
                    products: plist
                } as GRNSingle)}} invoice_total={(invoice_value)?parseFloat(invoice_value):0}/>
            </div>

            <div className="flex justify-end py-8">
                <div className="p-4 bg-gray-100 rounded ">
                    <table className="text-xl">
                        <tr>
                            <td>
                                Product Total:
                            </td>
                            <td> Rs. 12,000.00</td>
                        </tr>
                        
                        <tr>
                            <td>
                                Invoice Total:
                            </td>
                            <td> Rs. 12,000.00</td>
                        </tr>
                        
                        <tr>
                            <td>
                                Balance:
                            </td>
                            <td> Rs. 0.00</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}