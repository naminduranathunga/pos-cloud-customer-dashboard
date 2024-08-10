import { useCallback, useEffect, useState } from "react";
import { GRNSingle, GRNProduct, Vendor } from "@/interfaces/inventory/grn";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { get_next_grn_number, save_grn_data } from "./functions";
import { useToast } from "@/components/ui/use-toast";
import get_selected_branch from "@/lib/get_selected_branch";
import { CompanyBranch } from "@/interfaces/company";
import VendorSelector from "@/components/inventory/inventory_manager/vendor_selector";
import { useParams } from "react-router-dom";
import config from "@/lib/config";

const sample_products:GRNProduct[] = [];

function get_formatted_date(date_:string){
    //2024-06-07
    const date = new Date(date_);
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


export default function GRNViewPage(){
    const {grnId} = useParams() as {grnId: string};
    const [grn, setGRN] = useState<GRNSingle|null>(null);
    const [grnProductList, setGRNProductList] = useState<GRNProduct[]>(sample_products);
    const [loadingGRN, setLoadingGRN] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const {isLoading, get_user_jwt} = useFlexaroUser();
    const [invoice_value, setInvoiceValue] = useState("0");
    const {toast} = useToast();

    useEffect(()=>{
        if (isLoading) return;
        if (grn !== null) return;
        if (loadingGRN) return;

        const jwt = get_user_jwt();
        if (!jwt) return;

        setLoadingGRN(true);
        fetch(`${config.apiURL}/inventory-manager/grn/get-one?id=${grnId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
        }).then(resp => {
            if (resp.ok){
                return resp.json();
            }else {
                if (resp.status === 404){
                    toast({
                        title: "GRN not found",
                        variant: "destructive"
                    });
                    return;
                }
                throw new Error("Failed to fetch GRN");
            }
        }).then(data => {
            data = data.grn;
            const grn_:GRNSingle = {
                id: data.id,
                grn_number: data.grn_no,
                branch: data.branch_name,
                date: get_formatted_date(data.grn_date),
                vendor: {
                    id: data.vendor_id,
                    name: data.vendor_name
                },
                invoice_no: data.invoice_no,
                invoice_value: data.invoice_amount,
                total: data.total_amount,
                adjusted_total: data.adjustment,
                notes: data.notes,
                products: data.products,
                status: "completed"
            }
            setGRN(grn_);
        }).catch(err => {
            toast({
                title: "Failed to fetch GRN",
                variant: "destructive"
            });
            console.error(err);
        }).finally(() => {
            setLoadingGRN(false);
        });
    }, [grnId, isLoading, loadingGRN])


    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">{grn?grn.grn_number:"GRN ####"}</h1>
            </header>


            { grn && (<div className="grid grid-cols-3 gap-6">
                <table>
                    <tr>
                        <td>GRN No.</td>
                        <td>{grn.grn_number}</td>
                    </tr>
                    <tr>
                        <td>GRN Date</td>
                        <td>{grn.date}</td>
                    </tr>
                    <tr>
                        <td>Invoice No.</td>
                        <td>{grn.invoice_no}</td>
                    </tr>
                    <tr>
                        <td>Invoice Value</td>
                        <td>{grn.invoice_value}</td>
                    </tr>
                </table>
            </div>)}
            <hr className="my-4" />
            <div className="grid grid-cols-1 gap-6">

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