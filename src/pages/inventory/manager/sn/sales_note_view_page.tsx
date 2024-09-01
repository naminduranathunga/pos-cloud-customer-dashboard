import { useEffect, useState } from "react";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import config from "@/lib/config";
import { TableBody, TableHead, TableHeader, TableRow, Table, TableCell } from "@/components/ui/table";
import { SalesNoteInterface } from "@/interfaces/inventory/sales_notes";


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



export default function SNViewPage(){
    const {snId} = useParams() as {snId: string};
    const [salesNote, setSalesNote] = useState<SalesNoteInterface|null>(null);
    const [loadingSN, setLoadingSN] = useState(false);
    const {isLoading, get_user_jwt} = useFlexaroUser();
    const {toast} = useToast();

    useEffect(()=>{
        if (isLoading) return;
        if (salesNote !== null) return;
        if (loadingSN) return;

        const jwt = get_user_jwt();
        if (!jwt) return;

        setLoadingSN(true);
        fetch(`${config.apiURL}/inventory-manager/sn/get-one?id=${snId}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            },
        }).then(resp => {
            if (resp.ok){
                return resp.json();
            }else {
                if (resp.status === 404){
                    toast({
                        title: "Sales Note not found",
                        variant: "destructive"
                    });
                    return;
                }
                throw new Error("Failed to fetch SN");
            }
        }).then(data => {          
            setSalesNote(data as SalesNoteInterface);
        }).catch(err => {
            toast({
                title: "Failed to fetch GRN",
                variant: "destructive"
            });
            console.error(err);
        }).finally(() => {
            setLoadingSN(false);
        });
    }, [snId, isLoading, loadingSN])


    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">{salesNote?salesNote.sales_note_no:"SN-####"}</h1>
            </header>


            { salesNote && (<div className="grid grid-cols-3 gap-6 min-w-[800px]">
                <table>
                    <tr>
                        <td className="py-2">Sales Note No.</td>
                        <td className="py-2">{salesNote.sales_note_no}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Sales Date:</td>
                        <td className="py-2">{new Date((salesNote.sale_date) as string).toDateString()}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Status:</td>
                        <td className="py-2 capitalize">{salesNote.status}</td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <td className="py-2">Branch</td>
                        <td className="py-2">{salesNote.branch_name||""}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Customer:</td>
                        <td className="py-2">{salesNote.customer_name||"-"}</td>
                    </tr>
                    <tr>
                        <td className="py-2 opacity-0">-</td>
                        <td className="py-2"></td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <td className="py-2">Invoice Value</td>
                        <td className="py-2">{formatCurrency(salesNote.total_amount||0)}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Product Total.</td>
                        <td className="py-2">{formatCurrency(salesNote.discount||0)}</td>
                    </tr>
                    <tr>
                        <td className="py-2">Adustments</td>
                        <td className="py-2">{formatCurrency(salesNote.tax||0)}</td>
                    </tr>
                </table>
                
            </div>)}
            <hr className="my-4" />
            <h2 className="text-gray-800 text-xl font-semibold">Items:</h2>
            <div className="w-full mb-12">
                {
                    salesNote && 
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-end">Sale Price</TableHead>
                                    <TableHead className="text-end">Qty</TableHead>
                                    <TableHead className="text-end">Total</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    salesNote.items.map((product, index) => 
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{ product.product_name }</TableCell>
                                            <TableCell className="text-end">{ formatCurrency((product.sale_price||0) * 1)}</TableCell>
                                            <TableCell className="text-end">{ product.quantity }</TableCell>
                                            <TableCell className="text-end">{ formatCurrency(product.quantity * product.sale_price) }</TableCell>
                                        </TableRow>
                                    )
                                }

                                <TableRow>
                                    <TableHead colSpan={4} className="text-end text-lg">Sub Total</TableHead>
                                    <TableCell className="text-end text-lg">{ formatCurrency(salesNote.total_amount) }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead colSpan={4} className="text-end ">Discounts</TableHead>
                                    <TableCell className="text-end ">{ formatCurrency(salesNote.discount) }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead colSpan={4} className="text-end ">Delivery</TableHead>
                                    <TableCell className="text-end ">{ formatCurrency(salesNote.delivery_fee) }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead colSpan={4} className="text-end text-lg">Tax</TableHead>
                                    <TableCell className="text-end text-lg">{ formatCurrency(salesNote.tax) }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead colSpan={4} className="text-end text-lg">Total</TableHead>
                                    <TableCell className="text-end text-lg">{ formatCurrency(salesNote.total_amount + salesNote.delivery_fee + salesNote.tax - salesNote.discount) }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                }
            </div>

            {salesNote?.notes && <div>
                <div className="bg-gray-100 p-6">
                    <h2 className="text-gray-800 text-xl font-semibold">Notes:</h2>
                    <p>{salesNote?.notes||"-"}</p>
                </div>
            </div>}

            
        </div>
    )
}