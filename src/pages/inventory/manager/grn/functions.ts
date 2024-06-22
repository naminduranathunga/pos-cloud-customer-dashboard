import config from "@/lib/config";

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