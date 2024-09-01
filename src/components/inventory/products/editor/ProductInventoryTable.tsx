import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyBranch } from "@/interfaces/company";
import { FullProduct, ProductInventory } from "@/interfaces/products";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useEffect, useState } from "react";
import ProductStockEditorRow from "./ProductStockEditorRow";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


async function getInventory(product_id: number, jwt:string){
    const resp = await fetch(`${config.apiURL}/product-manager/products/get-stocks?id=${product_id}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });

    const inventories = await resp.json();

    if (!resp.ok){
        if (inventories.message){
            throw new Error(inventories.message);
        }
        throw new Error("Failed to fetch inventories");
    }

    return inventories as ProductInventory[];
}


async function getBranches(jwt: string){
    const response2 = await fetch(`${config.apiURL}/company-manager/branches/get`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (response2.ok) {
        return await response2.json() as CompanyBranch[];
    }
    return [];
}

export default function ProductEditorInventorySummary({product}:{product:FullProduct}) {

    const [inventory, setInventory] = useState<ProductInventory[]|null>(null);
    const [branches, setBranches] = useState<CompanyBranch[]|null>(null);
    const {isLoading, get_user_jwt} = useFlexaroUser();

    const isProductIdValid = (product.id && typeof (product.id) === "number" && product.id > 0);

        

    useEffect(() => {
        if (!product.id || typeof(product.id) !== "number" || product.id < 1) return;
        if (isLoading) return;

        const jwt = get_user_jwt();
        if (!jwt) return;

        getInventory(product.id, jwt).then((inventory) => {
            setInventory(inventory);
        }).catch((error) => {
            console.error(error);
        });

        getBranches(jwt).then((branches:CompanyBranch[]) => {
            setBranches(branches);
        }).catch((error) => {
            setBranches([]);
            console.error(error);
        });
    }, [product.id, isLoading, get_user_jwt]);

    const jwt = get_user_jwt();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Sales Price</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Stock</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    (isProductIdValid) ? (<>
                    {
                        (inventory === null) ? (
                            <TableRow>
                                <TableCell ><Skeleton className="w-12 h-4" /></TableCell>
                                <TableCell ><Skeleton className="w-12 h-4" /></TableCell>
                                <TableCell ><Skeleton className="w-12 h-4" /></TableCell>
                                <TableCell ><Skeleton className="w-12 h-4" /></TableCell>
                                <TableCell ><Skeleton className="w-12 h-4" /></TableCell>
                            </TableRow>
                        ):
                        <>
                        {
                            inventory.map((inventorySingle, index) => (
                                <ProductStockEditorRow key={index} stock={inventorySingle} branches={branches||undefined} 
                                onDelete={()=>{setInventory(inventory.filter((item, i)=>i !== index))} } 
                                onChange={(newStock)=>{setInventory(inventory.map((item, i)=>i === index ? newStock : item))}}
                                jwt={jwt||""}
                                />
                            ))
                        }
                        </>
                    } 
                    
                    </>) : (<>
                    <TableRow>
                        <TableCell colSpan={5}>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-gray-500">Save the product before add inventory</span>
                            </div>
                        </TableCell>
                    </TableRow>
                    </>)
                }
                

                {
                    (isProductIdValid && inventory && inventory.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-gray-500">No inventory found</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (<></>)
                }

                <TableRow>
                    <TableCell colSpan={5}>
                        <Button onClick={()=>{
                            if (inventory){
                                setInventory([...(inventory as ProductInventory[]), {
                                    product_id: product.id,
                                    branch_id: branches ? branches[0]._id : "",
                                    sales_price: 0,
                                    cost_price: 0,
                                    quantity: 0
                                }]);
                            }
                        }}><PlusCircle size={"1rem"} className="text-current me-2" /> <span>Add</span></Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}