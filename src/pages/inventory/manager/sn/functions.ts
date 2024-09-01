import { SalesNoteInterface } from "@/interfaces/inventory/sales_notes";
import config from "@/lib/config";

export interface GRNBody {
    id?: number;
    branch_id: string;
    vendor_id?: number;

    grn_number: string;
    grn_date: string;
    invoice_number?: string;
    invoice_date?: string;
    invoice_amount: number;
    total_amount: number;
    adjustment: number;
    notes: string;

    products: {
        product_id: number;
        quantity: number;
        cost_price: number;
        sale_price: number;
    }[];
};

export async function get_next_sn_number(branch_id:string, jwt:string){
    const res = await fetch(`${config.apiURL}/inventory-manager/sn/get-next-sn-number?branch_id=${branch_id}`, {
        headers:{
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (res.ok){
        const jsn = await res.json();
        return jsn.sales_note_no;
    } else if (res.status === 400){
        document.dispatchEvent(new Event("flexaro_user_unauthorized"));
        throw new Error("Anauthorized");
    } else if (res.status === 401){
        const jsn = await res.json();
        throw new Error(jsn.message);
    } else {
        throw new Error("Error! " + res.status);
    }
}


export async function save_sn_data(sn:SalesNoteInterface, jwt:string): Promise<SalesNoteInterface>{
    const res = await fetch(`${config.apiURL}/inventory-manager/sn/create`, {
        headers:{
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sn),
        method: "POST"
    });
    if (res.ok){
        const jsn = await res.json();
        return jsn as SalesNoteInterface;
    } else if (res.status === 400){
        document.dispatchEvent(new Event("flexaro_user_unauthorized"));
        throw new Error("Anauthorized");
    } else if (res.status === 401){
        const jsn = await res.json();
        throw new Error(jsn.message);
    } else {
        throw new Error("Error! " + res.status);
    }
}