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

export async function get_next_grn_number(branch_id:string, jwt:string){
    const res = await fetch(`${config.apiURL}/inventory-manager/grn/get-next-grn-number?branch_id=${branch_id}`, {
        headers:{
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (res.ok){
        const jsn = await res.json();
        return jsn.grn_number;
    } else if (res.status == 400){
        document.dispatchEvent(new Event("flexaro_user_unauthorized"));
        throw new Error("Anauthorized");
    } else if (res.status == 401){
        const jsn = await res.json();
        throw new Error(jsn.message);
    } else {
        throw new Error("Error! " + res.status);
    }
}


export async function save_grn_data(grn:GRNBody, jwt:string): Promise<GRNBody>{
    const res = await fetch(`${config.apiURL}/inventory-manager/grn/create`, {
        headers:{
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(grn),
        method: "POST"
    });
    if (res.ok){
        const jsn = await res.json();
        return jsn as GRNBody;
    } else if (res.status == 400){
        document.dispatchEvent(new Event("flexaro_user_unauthorized"));
        throw new Error("Anauthorized");
    } else if (res.status == 401){
        const jsn = await res.json();
        throw new Error(jsn.message);
    } else {
        throw new Error("Error! " + res.status);
    }
}