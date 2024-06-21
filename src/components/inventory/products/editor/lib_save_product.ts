import { FullProduct } from "@/interfaces/products";
import config from "@/lib/config";

const url_create = `${config.apiURL}/product-manager/products/create`;
const url_update = `${config.apiURL}/product-manager/products/update`;

export async function SaveProduct(product:FullProduct, jwt:string){
    let url = url_create;
    if (product.id){
        url = url_update;
    }

    const resp = await fetch(url, {
        method:"POST",
        headers:{
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    if (resp.ok){
        return await resp.json();
    } else {
        const error = await resp.json();
        throw new Error(error.message);
    }
}