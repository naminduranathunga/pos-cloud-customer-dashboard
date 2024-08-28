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
import { TableBody, TableHead, TableHeader, TableRow, Table, TableCell } from "@/components/ui/table";

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


function formatCurrency(value: number){
    return value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'});
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
                adjusted_total: parseFloat(data.adjustment),
                notes: data.notes,
                products: data.products,
                status: "completed"
            }
            setGRN(grn_);
            setGRNProductList(data.products);
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


            { grn && (<div className="grid grid-cols-3 gap-6 min-w-[800px]">
                <table>
                    <tr>
                        <td className="py-2">GRN No.</td>
                        <td className="py-2">{grn.grn_number}</td>
                    </tr>
                    <tr>
                        <td className="py-2">GRN Date</td>
                        <td className="py-2">{grn.date}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Invoice No.</td>
                        <td className="py-2">{grn.invoice_no}</td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <td className="py-2">Branch</td>
                        <td className="py-2">{grn.grn_number}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Vendor:</td>
                        <td className="py-2">{grn.vendor?.name}</td>
                    </tr>
                    <tr>
                        <td className="py-2 opacity-0">-</td>
                        <td className="py-2"></td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <td className="py-2">Invoice Value</td>
                        <td className="py-2">{formatCurrency(grn.invoice_value||0)}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Product Total.</td>
                        <td className="py-2">{formatCurrency(grn.total||0)}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Adustments</td>
                        <td className="py-2">{formatCurrency(grn.adjusted_total||0)}</td>
                    </tr>
                </table>
                
            </div>)}
            <hr className="my-4" />
            <div className="w-full mb-12">
                {
                    grnProductList && 
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Cost Price</TableHead>
                                    <TableHead>Sale Price</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    grnProductList.map((product, index) => 
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{ product.product.name }</TableCell>
                                            <TableCell>{ formatCurrency(product.cost_price * 1)}</TableCell>
                                            <TableCell>{ formatCurrency((product.sale_price||0) * 1)}</TableCell>
                                            <TableCell>{ product.quantity }</TableCell>
                                            <TableCell>{ formatCurrency(product.quantity * product.cost_price) }</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                }
            </div>

            {grn?.notes && <div>
                <div className="bg-gray-100 p-6">
                    <h2 className="text-gray-800 text-xl font-semibold">Notes:</h2>
                    <p>{grn?.notes||"-"}</p>
                </div>
            </div>}

            
        </div>
    )
}