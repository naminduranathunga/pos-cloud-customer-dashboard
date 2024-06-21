
import { useConfirm } from "@/components/ui/custom/confirm";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GRNProduct } from "@/interfaces/inventory/grn";
import { Check, CircleX, Pen, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";


function formatCurrency(value: number){
    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
}


async function getProductBySearchTerm(searchTerm: string){
    return {
        id: -1, 
        product: {
            id: "1",
            name: "Product 1"
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
                    alert("Deleted " + product.product.id);
                }
            }
        )
    }
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

export default function GRNProductTable({data, onChange}:{
    data: GRNProduct[],
    onChange: Function
}){
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const onKeyDown = (e:KeyboardEvent) => {
        if (e.key === "Enter"){
            e.preventDefault();
            AddGRNProduct();
        }
    }

    const AddGRNProduct = ()=>{
        if (!searchTerm){
            return;
        }
        getProductBySearchTerm(searchTerm).then((product)=>{
            onChange([...data, product]);
            setSearchTerm("");
        });
    }

    const OnChangeProducts = useCallback((product:GRNProduct, index:number)=>{
        if (index > -1){
            data[index] = product;
            onChange([...data]);
        }
    }, [data, onChange]);

    useEffect(()=>{
        if (!inputRef.current) return;
        
        inputRef.current?.addEventListener("keydown", onKeyDown);
        return ()=>{
            inputRef.current?.removeEventListener("keydown", onKeyDown);
        }
    }, [inputRef]);


    return (
        <Table>
            <TableHeader>
                <TableRow className="divide-x">
                    <TableHead>Product</TableHead>
                    <TableHead className="text-end">Cost Price</TableHead>
                    <TableHead className="text-end">Sales Price</TableHead>
                    <TableHead className="text-end">Quantity</TableHead>
                    <TableHead className="text-end">Total cost</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row: GRNProduct, index: number) => (
                    <EditableProductRow key={index} product={row} onChange={(product:GRNProduct)=>{OnChangeProducts(product, index)}}/>
                ))}
                
                <TableRow className="divide-x">
                    <TableHead colSpan={4} className="text-end flex items-center gap-1">
                        <Input value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}} ref={inputRef} placeholder="Search product by name or scan the barcode" />
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md ms-4" onClick={AddGRNProduct}>Add</button>
                    </TableHead>
                    <TableCell>-</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                <TableRow className="divide-x">
                    <TableHead colSpan={4} className="text-end">Total</TableHead>
                    <TableCell className="text-end text-lg max-w-8"><b>{formatCurrency(data.reduce((acc, row)=>acc + row.cost_price * row.quantity, 0))}</b></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}