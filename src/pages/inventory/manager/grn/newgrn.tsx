import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader, Loader2, Save } from "lucide-react";
import GRNProductTable from "@/components/inventory/inventory_manager/grn_product_table";
import { useCallback, useEffect, useState } from "react";
import { GRNSingle, GRNProduct, Vendor } from "@/interfaces/inventory/grn";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { get_next_grn_number, save_grn_data } from "./functions";
import { useToast } from "@/components/ui/use-toast";
import get_selected_branch from "@/lib/get_selected_branch";
import { CompanyBranch } from "@/interfaces/company";
import VendorSelector from "@/components/inventory/inventory_manager/vendor_selector";
import { setTimeout } from "timers/promises";



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
        grn_number: "-1",
        vendor: null,
        date: get_formatted_date(),
        invoice_no: "",
        status: "draft",
        products: [],
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
    //const [grnProductList, setGRNProductList] = useState<GRNProduct[]>(sample_products);
    const [loadingGRNno, setLoadingGRNno] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const {isLoading, get_user_jwt} = useFlexaroUser();
    const [invoice_value, setInvoiceValue] = useState("0");
    const {toast} = useToast();

    const saveGRN = useCallback(()=>{
        if (isSaving) return;
        if (isLoading) return;

        const jwt = get_user_jwt();
        if (!jwt){
            document.dispatchEvent(new Event("flexaro_user_unauthorized"));
            return;
        }
        const branch = get_selected_branch() as CompanyBranch|null;
        if (!branch){
            return;
        }

        // invoice_value should be equal to the sum of all products cost price
        let total = grn.products.reduce((acc, p)=>acc + (p.cost_price * p.quantity), 0);
        const adj = (grn.adjusted_total)?grn.adjusted_total:0;
        let inv_val = parseFloat(invoice_value);
        if (Math.abs(total + adj - inv_val) > 0.01){
            toast({
                title: "Adjustment Error",
                description: "Please check the invoice value. It should be equal to the sum of all products cost price.",
                variant: "destructive"
            });
            return;
        }
        setIsSaving(true);

        save_grn_data({
            branch_id: branch._id,
            vendor_id: grn.vendor?.id,
            grn_number: grn.grn_number,
            grn_date: grn.date,
            invoice_number: grn.invoice_no,
            invoice_date: grn.date, // need to change later
            invoice_amount: parseFloat(invoice_value),
            total_amount: total,
            adjustment: (grn.adjusted_total)?grn.adjusted_total:0,
            notes: (grn.notes)?grn.notes:"",
            products: grn.products.map((p)=>({
                product_id: parseInt(p.product.id),
                quantity: p.quantity,
                cost_price: p.cost_price,
                sale_price: p.sales_price
            }))
        }, jwt).then((grn)=>{
            setIsSaving(false);
            toast({
                title: "GRN Saved",
                description: `GRN ${grn.id} has been saved successfully.`,
            });
            window.location.href = "/inventory/manager/grn/" + grn.id;

        }).catch((err)=>{
            setIsSaving(false);
            console.log(err);
            toast({
                title: "Error",
                description: "An error occured while saving GRN. Please try again later.",
                variant: "destructive"
            })
        })
    }, [isSaving, isLoading, grn, invoice_value, get_user_jwt]);

    useEffect(()=>{
        if (isLoading) return;
        if (loadingGRNno) return;
        if (grn.grn_number != "-1") return;

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

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">New Good Received Note</h1>

                <Button className="flex items-center gap-2 ms-auto" onClick={saveGRN}>
                    {isSaving ? <>Saving... <Loader2 className="animate-spin" size={"1rem"} /></> : <><Save size={"1em"} /> Save</>} </Button>
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
                        <textarea placeholder="Add notes here." value={grn.notes||""} 
                        onChange={(e)=>{setGRN({...grn, notes: e.target.value} as GRNSingle)}}
                        className="w-full border rounded p-2" rows={4}></textarea>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-1 gap-6">
                <GRNProductTable data={grn.products} onChange={(plist:GRNProduct[])=>{setGRN({
                    ...grn,
                    products: plist
                } as GRNSingle)}} invoice_total={(invoice_value)?parseFloat(invoice_value):0}
                adjusted_total={grn.adjusted_total || 0} onAdjustedTotalChange={(val:number)=>{setGRN({...grn, adjusted_total: val} as GRNSingle)}}
                />
            </div>
        </div>
    )
}