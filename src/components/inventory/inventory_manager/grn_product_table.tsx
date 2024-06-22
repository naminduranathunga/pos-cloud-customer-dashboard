
import { useConfirm } from "@/components/ui/custom/confirm";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GRNProduct } from "@/interfaces/inventory/grn";
import { Check, CircleX, Pen, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductSearchBox from "./product_search_box";
import { ProductSimple } from "@/interfaces/products";
import { useToast } from "@/components/ui/use-toast";


function formatCurrency(value: number){
    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
}


async function getProductByProductSimple(product: ProductSimple){
    return {
        id: -1, 
        product: {
            id: product.id,
            name: product.name
        },
        cost_price: 0,
        sales_price: 0,
        quantity: 0
    } as GRNProduct;
}


function EditableProductRow({product, onChange}:{
    product: GRNProduct,
    onChange: Function
}){
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editableProductState, setEditableProductState] = useState<GRNProduct>(product);
    const {Confirm} = useConfirm();

    const cancelEditing = () =>{
        setIsEditing(false);
        setEditableProductState(product);
    }

    const saveChanges = () =>{
        onChange(editableProductState);
        setIsEditing(false);
    }
    
    const confirmDelete = () => {
        Confirm(
            "Delete Entry",
            `Do you want to delete entry for ${product.product.name}?`,
            "destructive",
            (confirmed:boolean)=>{
                if (confirmed){
                    onChange(null);
                }
            }
        )
    }

    useEffect(()=>{
        setEditableProductState(product);
    }, [product]);
    
    return (
        <TableRow className="divide-x">
            <TableCell>{editableProductState.product.name}</TableCell>
            <TableCell className="text-end">{isEditing? 
                (<Input value={editableProductState.cost_price} onChange={(e)=>{setEditableProductState({
                    ...editableProductState,
                    cost_price: parseFloat(e.target.value)
                })}} />) :
                formatCurrency(editableProductState.cost_price)}</TableCell>
            <TableCell className="text-end">{isEditing? 
                (<Input value={editableProductState.sales_price} onChange={(e)=>{
                    setEditableProductState({
                        ...editableProductState,
                        sales_price: parseFloat(e.target.value)
                    })
                }} />) : 
                formatCurrency(editableProductState.sales_price)}</TableCell>
            <TableCell className="text-end">{isEditing? 
                (<Input value={editableProductState.quantity} onChange={(e)=>{
                    setEditableProductState({
                        ...editableProductState,
                        quantity: parseFloat(e.target.value)
                    })
                }} />) : 
                editableProductState.quantity}</TableCell>
            <TableCell className="text-end">{formatCurrency(editableProductState.cost_price * editableProductState.quantity)}</TableCell>
            <TableCell className="text-end">
                {
                    isEditing? (
                        <>
                            <button className="hover:text-green-500" onClick={saveChanges}><Check size={"1rem"} /></button>
                            <button className="ms-4 hover:text-red-500" title="cancel" onClick={cancelEditing}><CircleX size={"1rem"} /></button>
                        </>
                    ):(
                        <>
                            <button className="hover:text-green-500" title="Edit" onClick={()=>{setIsEditing(true)}}><Pen size={"1rem"} /></button>
                            <button className="ms-4 hover:text-red-500" title="cancel" onClick={()=>{confirmDelete()}}><Trash2 size={"1rem"} /></button>
                        </>
                    )
                }

            </TableCell>
        </TableRow>
    )

}

export default function GRNProductTable({data, invoice_total, onChange}:{
    data: GRNProduct[],
    invoice_total: number,
    onChange: Function
}){
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { toast } = useToast();

    const AddGRNProduct = (product:ProductSimple)=>{
        // check if the product already exists in the suggestions
        if (data.find((p)=>(p.product.id === product.id))){
            toast({
                title: "Product already exists",
            });
            return;
        }
        getProductByProductSimple(product).then((product)=>{
            onChange([...data, product]);
            setSearchTerm("");
        });
    }

    const OnChangeProducts = useCallback((product:GRNProduct|null, index:number)=>{
        if (index < 0) return;
        if (!product){
            console.log("deleting", index, data[index]);

            const filtered = data.filter((_, i)=>i !== index);
            onChange(JSON.parse(JSON.stringify(filtered)));
            return;
        }
        data[index] = product;
        onChange([...data]);
    }, [data, onChange]);

    const total = data.reduce((acc, row)=>acc + row.cost_price * row.quantity, 0);
    const balance = total - invoice_total;

    return (
        <Table className="overflow-y-visible">
            <TableHeader>
                <TableRow className="divide-x">
                    <TableHead>Product</TableHead>
                    <TableHead className="text-end">Cost Price</TableHead>
                    <TableHead className="text-end">Sales Price</TableHead>
                    <TableHead className="text-end">Quantity</TableHead>
                    <TableHead className="text-end">Total cost</TableHead>
                    <TableHead className="text-end min-w-24">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.length === 0 && (
                        <TableRow className="divide-x">
                            <TableCell colSpan={6} className="text-center">No products added</TableCell>
                        </TableRow>
                    )
                }
                {data.map((row: GRNProduct, index: number) => {
                    console.log(row);
                    return (
                    <EditableProductRow key={index} product={row} onChange={(product:GRNProduct)=>{OnChangeProducts(product, index)}}/>
                )})}
                
                <TableRow className="divide-x">
                    <TableHead colSpan={4} className="text-end flex items-center gap-1">
                        <ProductSearchBox onAddProduct={AddGRNProduct} />
                    </TableHead>
                    <TableCell>-</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow className="divide-x">
                    <TableHead colSpan={4} className="text-end">Total</TableHead>
                    <TableCell className="text-end text-lg max-w-8"><b>{formatCurrency(total)}</b></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow className="divide-x">
                    <TableHead colSpan={4} className="text-end">Invoice Total</TableHead>
                    <TableCell className="text-end text-lg max-w-8"><b>{formatCurrency(invoice_total)}</b></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow className="divide-x">
                    <TableHead colSpan={4} className="text-end">Total</TableHead>
                    <TableCell className={"text-end text-lg max-w-8" + ((balance != 0)?" text-red-500":"")}><b>{formatCurrency(balance)}</b></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}