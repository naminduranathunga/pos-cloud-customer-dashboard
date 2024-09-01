import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { get_next_sn_number, save_sn_data } from "./functions";
import { useToast } from "@/components/ui/use-toast";
import get_selected_branch from "@/lib/get_selected_branch";
import { CompanyBranch } from "@/interfaces/company";
import { SalesNoteInterface } from "@/interfaces/inventory/sales_notes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomerSelector from "@/components/inventory/inventory_manager/customer_selector";
import CustomerInterface from "@/interfaces/inventory/customer";
import SNProductTable from "@/components/inventory/inventory_manager/sn/sn_product_table";



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
function createNewSN(){
    // Create new GRN
    return {
        sales_note_no: "",
        total_amount: 0,
        discount: 0,
        adjustment: 0,
        tax: 0,
        delivery_fee: 0,
        branch_id: "",
        items: [],
        sale_date: get_formatted_date(),
        status: "draft",
        notes: ""
    } as SalesNoteInterface;
}

export default function CreateNewSNPage(){
    const [salesNote, setSalesNote] = useState<SalesNoteInterface>(createNewSN());
    const [loadingSNno, setLoadingSNno] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const {isLoading, get_user_jwt} = useFlexaroUser();
    const {toast} = useToast();

    const saveSN = useCallback(()=>{
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

        // items count should be more than 0
        // each must have at least 1 quantity
        if (salesNote.items.length === 0){
            toast({
                title: "Error",
                description: "Please add at least one product to the sales note.",
                variant: "destructive"
            });
            return;
        }
        for (let i=0; i<salesNote.items.length; i++){
            if (salesNote.items[i].quantity === 0){
                toast({
                    title: "Error",
                    description: "Quantity of product cannot be zero.",
                    variant: "destructive"
                });
                return;
            }
        }

        setIsSaving(true);
        
        save_sn_data({ ...salesNote,
            branch_id: branch._id,
            sale_date: new Date(salesNote.sale_date).toISOString(),
        }, jwt).then((sn_new)=>{
            setIsSaving(false);
            toast({
                title: "GRN Saved",
                description: `GRN ${1} has been saved successfully.`,
            });
            //window.location.href = "/inventory/manager/sn/" + sn_new.id;

        }).catch((err)=>{
            setIsSaving(false);
            console.log(err);
            toast({
                title: "Error",
                description: "An error occured while saving SN. Please try again later.",
                variant: "destructive"
            })
        })
    }, [isSaving, isLoading, salesNote, get_user_jwt, toast]);

    useEffect(()=>{
        if (isLoading) return;
        if (loadingSNno) return;
        if (salesNote.sales_note_no !== "") return;

        setLoadingSNno(true);
        const jwt = get_user_jwt();
        if (!jwt){
            document.dispatchEvent(new Event("flexaro_user_unauthorized"));
            return;
        }

        const branch = get_selected_branch() as CompanyBranch|null;
        if (!branch){
            return;
        }

        get_next_sn_number(branch._id, jwt).then((sales_note_no:string)=>{
            setSalesNote({...salesNote, sales_note_no});
            setLoadingSNno(false);
        }).catch(()=>{
            // handle errors
            toast({
                title:"Error",
                description: "An error occured while getting SN number. Please try again later.",
                variant: "destructive"
            })
            setLoadingSNno(false);
        })
    }, [isLoading, loadingSNno, salesNote, get_user_jwt, toast])

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">New Sales Note</h1>

                <Button className="flex items-center gap-2 ms-auto" onClick={saveSN}>
                    {isSaving ? <>Saving... <Loader2 className="animate-spin" size={"1rem"} /></> : <><Save size={"1em"} /> Save</>} </Button>
            </header>


            <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sales_note_no" className="text-nowrap">Sales Note No.:</Label>
                        <div className="flex items-center gap-2">
                            <Input id="sales_note_no" value={salesNote.sales_note_no} disabled/>
                            {loadingSNno && <Loader2 size={"1em"} className="animate-spin" />}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sale_date" className="text-nowrap">Sale Date:</Label>
                        <Input id="sale_date" type="date" value={salesNote.sale_date as string} onChange={(e)=>{
                            setSalesNote({ ...salesNote, sale_date: e.target.value })
                            console.log(e.target.value)
                        }}/>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sn_status" className="text-nowrap">Status:</Label>
                        <Select value={salesNote.status} onValueChange={(status:"draft" | "confirmed" | "completed" | "returned" | "canceled")=>{
                            setSalesNote({ ...salesNote, status })
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="returned">Returned</SelectItem>
                                <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent> 
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sn_payment_method" className="text-nowrap">Payment Method:</Label>
                        <Input id="sn_payment_method" type="text" value={salesNote.payment_method} onChange={(e)=>{
                            setSalesNote({ ...salesNote, payment_method: e.target.value })
                        }}
                        placeholder="Cash, Card, etc."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sn_payment_status" className="text-nowrap">Payment Status:</Label>
                        <Input id="sn_payment_status" type="text" value={salesNote.payment_status} 
                            onChange={(e)=>{ setSalesNote({ ...salesNote, payment_method: e.target.value }) }}
                            placeholder="Any other info about payment status."
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_vendor" className="text-nowrap">Customer:</Label>
                        <CustomerSelector customer={salesNote.customer_id?{
                            id: salesNote.customer_id,
                            name: salesNote.customer_name || ""
                        } as CustomerInterface:null} 
                        
                        onChange={(customer)=>{
                            setSalesNote({
                                ...salesNote, 
                                customer_id: (customer && customer.id)?customer.id:undefined,
                                customer_name: (customer && customer.name)?customer.name:undefined
                                })}}/>
                        {/*<VendorSelector vendor={salesNote.customer_id} onChange={(venodr)=>{setSalesNote({...salesNote, vendor: venodr})}}/>*/}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_ex_notes" className="text-nowrap">Notes:</Label>
                        <textarea placeholder="Add notes here." value={salesNote.notes||""} 
                        onChange={(e)=>{setSalesNote({...salesNote, notes: e.target.value})}}
                        className="w-full border rounded p-2" rows={4}></textarea>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-1 gap-6">
                <SNProductTable salesNote={salesNote} onChange={(sn:SalesNoteInterface)=>{setSalesNote(sn)}} />
                {/*<GRNProductTable data={grn.products} onChange={(plist:GRNProduct[])=>{setSalesNote({
                    ...grn,
                    products: plist
                } as GRNSingle)}} invoice_total={(invoice_value)?parseFloat(invoice_value):0}
                adjusted_total={grn.adjusted_total || 0} onAdjustedTotalChange={(val:number)=>{setSalesNote({...grn, adjusted_total: val} as GRNSingle)}}
                />*/}
            </div>
        </div>
    )
}