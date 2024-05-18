import ProductCategory from "@/interfaces/product_category";
import config from "./config";

export async function fetchCategories(jwt:string): Promise<ProductCategory[]>{
    const resp = await fetch(`${config.apiURL}/product-manager/product-category/get?populate=1`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (resp.ok){
        const cats = await resp.json();
        const categories: ProductCategory[] = cats.map((cat: any) => {
            return {
                id: cat._id,
                name: cat.name,
                parent: (cat.parent? {id: cat.parent._id, name: cat.parent.name, parent: cat.parent.parent} : null)
            }
        });
        return categories;
    }else {
        if (resp.status === 401){
            throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch categories");
    }
}