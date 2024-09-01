import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/custom/confirm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CompanyBranch } from "@/interfaces/company";
import { ProductInventory } from "@/interfaces/products";
import config from "@/lib/config";
import { Check, Loader2, Pen, Trash, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";


export default function ProductStockEditorRow({stock, branches, onDelete, onChange, jwt}:{stock:ProductInventory, branches?:CompanyBranch[], onDelete?:()=>void, onChange?:(stock:ProductInventory)=>void, jwt:string}) {
    const [stockItem, setStockItem] = useState<ProductInventory>(stock);
    const [isEditing, setIsEditing] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const {Confirm} = useConfirm();
    const { toast } = useToast();

    const handleDelete = useCallback(()=>{
        // Delete the stock item
        Confirm(
            "Delete Stock Item",
            "Are you sure you want to delete this stock item?",
            "destructive",
            (confirmed) => {
                if (!confirmed) return;
                if (!stock.id){
                    onDelete?.();
                    return;
                }
                setShowLoader(true);
                // Delete the stock item
                fetch(`${config.apiURL}/product-manager/products/remove-stocks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        id: stock.id
                    })
                }).then((resp)=>{
                    if (resp.ok){
                        // Remove the stock item from the list
                        onDelete?.();
                    }
                }).catch((error)=>{
                    console.error(error);
                }).finally(()=>{
                    setShowLoader(false);
                });
            }
        )
    }, [stock, Confirm, onDelete, jwt]);

    const handleSaveChanges = useCallback(()=>{
        // Save the changes
        setShowLoader(true);
        fetch(`${config.apiURL}/product-manager/products/add-stocks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(stockItem)
        }).then((resp)=>{
            if (resp.ok){
                setIsEditing(false);
                return resp.json()
            }
        }).then((data)=>{
            //setStockItem(data as ProductInventory);
            onChange?.(data as ProductInventory);
        }).catch((error)=>{
            console.error(error);
            toast({
                title: "Failed to save changes",
                description: "Failed to save the changes. Please try again later.",
                variant: "destructive"
            })
        }).finally(()=>{
            setShowLoader(false);
        })
    }, [stockItem, toast, onChange, jwt]);

    useEffect(()=>{
        setStockItem(stock);
        if (!stock.id){
            setIsEditing(true);
        }
    }, [stock, branches]);

    return (
        <TableRow key={stock.id}>
            <TableCell>
                {stock.id}
            </TableCell>
            <TableCell>
                {
                    isEditing ? (
                        <Select value={stock.branch_id} onValueChange={(val)=>{
                            setStockItem({
                                ...stockItem,
                                branch_id: val
                            });
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select the branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    branches?.map((branch)=>(
                                        <SelectItem key={branch._id} value={branch._id}>{branch.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    ) : (
                        branches?.find((branch)=>branch._id === stock.branch_id)?.name || "-"
                    )
                }
            </TableCell>
            <TableCell>
                {
                    isEditing ? (
                        <input className="w-full px-2 py-3" type="number" min={0} value={stockItem.cost_price}
                            onChange={(e)=>setStockItem({
                                ...stockItem,
                                cost_price: parseFloat(e.target.value)
                            })} 
                        title="Cost Price" />
                    ) : (
                        stock.cost_price
                    )
                }
            </TableCell>
            <TableCell>
                {
                    isEditing ? (
                        <input className="w-full px-2 py-3 text-end" type="number" min={0} value={stockItem.sales_price}
                            onChange={(e)=>setStockItem({
                                ...stockItem,
                                sales_price: parseFloat(e.target.value)
                            })} 
                        title="Sales Price" />
                    ) : (
                        stock.sales_price
                    )
                }
            </TableCell>
            <TableCell>
                {
                    isEditing ? (
                        <input className="w-full px-2 py-3 text-end" type="number" min={0} value={stockItem.quantity}
                            onChange={(e)=>{
                                let value = parseInt(e.target.value);
                                if (isNaN(value)) value = 0;
                                setStockItem({
                                    ...stockItem,
                                    quantity: value
                                });
                            }} 
                        title="Stock" />
                    ) : (
                        stock.quantity
                    )
                }
            </TableCell>
            <TableCell className="w-36">
                {
                    showLoader ? (
                        <Loader2 size={16} className="animate-spin" />
                    ):<>
                    {
                        isEditing ? <>
                            <Button title="Save" variant={"ghost"} onClick={handleSaveChanges} className="hover:text-green-600"><Check size={16} className="text-current" /></Button>
                            <Button title="Cancel" variant={"ghost"} onClick={()=>setIsEditing(false)} className="ms-2 hover:text-red-600"><X size={16} className="text-current" /></Button>
                        </> : 
                        <>
                            <Button title="Edit" variant={"ghost"} onClick={()=>setIsEditing(true)} className="hover:text-green-600"><Pen size={16} className="text-current" /></Button>
                            <Button title="Delete" variant={"ghost"} onClick={handleDelete} className="ms-2 hover:text-red-600"><Trash size={16} className="text-current" /></Button>
                        </>
                    }
                    </>
                }
            </TableCell>
        </TableRow>
    )
}