import { SalesNoteInterface, SalesNoteItemInterface } from "@/interfaces/inventory/sales_notes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductSearchBox from "../product_search_box";
import { useCallback, useState } from "react";
import { ProductSimple } from "@/interfaces/products";
import MultiPricedProductSelect from "./MutiPricedProductSelect";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import formatCurrency from "@/lib/formatCurrency";

const reCalculateSalesNote = (salesNote: SalesNoteInterface) => {
    let total_amount = 0;
    salesNote.items.forEach((item) => {
        total_amount += item.sale_price * item.quantity;
    });
    salesNote.total_amount = total_amount;
    return salesNote;
}

function SNProdutRow({item, index, onChange, onDelete}: {item: SalesNoteItemInterface, index:number, onChange: (changed:SalesNoteItemInterface)=>void, onDelete?:()=>void}) {
    return (
        <TableRow className="divide-x">
            <TableCell className="w-12">{index + 1}</TableCell>
            <TableCell>{item.product_name}</TableCell>
            <TableCell className="text-end w-32">
                <input className="w-full px-2 py-3 text-end" type="number" min={0} value={item.sale_price}
                    onChange={(e)=>{
                        let c = parseFloat(e.target.value);
                        if (isNaN(c)) c = 0;
                        onChange({...item, sale_price: c})
                        console.log("onChange", c);
                    }} title="Unit price" />
            </TableCell>
            <TableCell className="text-end p-0 w-32">
                <input className="w-full px-2 py-3 text-end" type="number" min={0} value={item.quantity}
                    onChange={(e)=>{
                        let c = parseFloat(e.target.value);
                        if (isNaN(c)) c = 0;
                        onChange({...item, quantity: c})
                    }} 
                 title="Qty" />
            </TableCell>
            <TableCell className="text-end w-32">
                <input className="w-full px-2 py-3 text-end" type="number" min={0} value={item.discount}
                    onChange={(e)=>{
                        let c = parseFloat(e.target.value);
                        if (isNaN(c)) c = 0;
                        onChange({...item, discount: c})
                    }} 
                 title="Discount" />
            </TableCell>
            <TableCell className="text-end w-32">{formatCurrency(item.sale_price * item.quantity - item.discount)}</TableCell>
            <TableCell className="text-end w-32">
                <Button variant={"ghost"} className="btn btn-secondary" onClick={()=>{onDelete && onDelete()}} title="Delete">
                    <Trash size={18} className="text-current" />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default function SNProductTable({
    salesNote,
    onChange,
}: {
    salesNote: SalesNoteInterface;
    onChange?: (salesNote: SalesNoteInterface) => void;
}){
    const [multiPricedProduct, setMultiPricedProduct] = useState<ProductSimple|null>(null);

    const AddSNProduct = useCallback((product:ProductSimple) => {
        if (product){
            if (product.prices.length > 1){
                // show price selection dialog
                setMultiPricedProduct(product);
            } else {
                const item = {
                    product_id: product.id,
                    product_name: product.name,
                    quantity: 1,
                    sale_price: product.prices.length > 0 ? parseFloat(product.prices[0] + "") : 0,
                    discount: 0
                }
                salesNote.items.push(item);
                reCalculateSalesNote(salesNote);
                if (onChange) onChange(salesNote);
            }
            
        }
    }, [onChange, salesNote]);

    const onProductPriceSelected = useCallback((product:ProductSimple, priceIndex:number)=>{
        if (product){
            const item = {
                product_id: product.id,
                product_name: product.name,
                quantity: 1,
                sale_price: parseFloat(product.prices[priceIndex] + ""),
                discount: 0
            }
            salesNote.items.push(item);
            reCalculateSalesNote(salesNote);
            if (onChange) onChange(salesNote);
        }
    }, [salesNote, onChange]);

    const onChangeProduct = useCallback((index:number, changed:SalesNoteItemInterface)=>{
        salesNote.items = [...salesNote.items.slice(0, index), changed, ...salesNote.items.slice(index+1)];
        console.log("onChangeProduct", index, changed);
        reCalculateSalesNote(salesNote);
        if (onChange) onChange({...salesNote});
    }, [salesNote, onChange]);

    return (
        <>
            <Table className="overflow-y-visible">
                <TableHeader>
                    <TableRow className="divide-x">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-end">Unit Price</TableHead>
                        <TableHead className="text-end">Quantity</TableHead>
                        <TableHead className="text-end">Discount</TableHead>
                        <TableHead className="text-end">Total Price</TableHead>
                        <TableHead className="text-end">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {salesNote.items.map((item, index) => (
                        <SNProdutRow key={index} item={item} index={index} onChange={(changed)=>onChangeProduct(index, changed)}
                        onDelete={()=>{
                            salesNote.items = [...salesNote.items.slice(0, index), ...salesNote.items.slice(index+1)];
                            reCalculateSalesNote(salesNote);
                            if (onChange) onChange({...salesNote});
                        }}
                        />
                    ))}
                    {/*salesNote.items.map((item, index) => (
                        <TableRow key={index} className="divide-x">
                            <TableCell className="w-12">{index + 1}</TableCell>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell className="text-end">{item.sale_price}</TableCell>
                            <TableCell className="text-end">{item.quantity}</TableCell>
                            <TableCell className="text-end">{item.discount}</TableCell>
                            <TableCell className="text-end">{item.sale_price * item.quantity}</TableCell>
                            <TableCell className="text-end">
                                <Button variant={"ghost"} className="btn btn-secondary" onClick={()=>{}} title="Delete">
                                    <Trash size={18} className="text-current" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))*/}
                    {
                        salesNote.items.length === 0 && (
                            <TableRow className="divide-x">
                                <TableCell colSpan={6} className="text-center">No products added</TableCell>
                            </TableRow>
                        )
                    }
                    <TableRow className="divide-x">
                        <TableHead colSpan={4} className="text-end xflex items-center gap-1">
                            <ProductSearchBox onAddProduct={AddSNProduct} />
                        </TableHead>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    <TableRow className="divide-x">
                        <TableHead colSpan={5} className="text-end">Sub Total</TableHead>
                        <TableCell className="text-end">{formatCurrency(salesNote.total_amount)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    <TableRow className="divide-x">
                        <TableHead colSpan={5} className="text-end">Discount</TableHead>
                        <TableCell className="text-end w-36">
                        <input className="w-full px-2 py-3 text-end" type="number" min={0} value={salesNote.discount}
                            onChange={(e)=>{
                                let c = parseFloat(e.target.value);
                                if (isNaN(c)) c = 0;
                                salesNote.discount = c;
                                onChange && onChange({...salesNote})
                            }} 
                        title="Discount" />
                        </TableCell>
                        <TableCell>LKR</TableCell>
                    </TableRow>

                    <TableRow className="divide-x">
                        <TableHead colSpan={5} className="text-end">Adjustment</TableHead>
                        <TableCell className="text-end w-36">
                        <input className="w-full px-2 py-3 text-end" type="number" min={0} value={salesNote.adjustment}
                            onChange={(e)=>{
                                let c = parseFloat(e.target.value);
                                if (isNaN(c)) c = 0;
                                salesNote.adjustment = c;
                                onChange && onChange({...salesNote})
                            }} 
                        title="Adjustment" />
                        </TableCell>
                        <TableCell>LKR</TableCell>
                    </TableRow>

                    <TableRow className="divide-x">
                        <TableHead colSpan={5} className="text-end">Tax</TableHead>
                        <TableCell className="text-end w-36">
                        <input className="w-full px-2 py-3 text-end" type="number" min={0} value={salesNote.tax}
                            onChange={(e)=>{
                                let c = parseFloat(e.target.value);
                                if (isNaN(c)) c = 0;
                                salesNote.tax = c;
                                onChange && onChange({...salesNote})
                            }} 
                        title="Tax" />
                        </TableCell>
                        <TableCell>LKR</TableCell>
                    </TableRow>

                    <TableRow className="divide-x">
                        <TableHead colSpan={5} className="text-end">Delivery Fee</TableHead>
                        <TableCell className="text-end w-36">
                        <input className="w-full px-2 py-3 text-end" type="number" min={0} value={salesNote.delivery_fee}
                            onChange={(e)=>{
                                let c = parseFloat(e.target.value);
                                if (isNaN(c)) c = 0;
                                salesNote.delivery_fee = c;
                                onChange && onChange({...salesNote})
                            }} 
                        title="Delivery Fee" />
                        </TableCell>
                        <TableCell>LKR</TableCell>
                    </TableRow> 

                    <TableRow className="divide-x">
                        <TableHead colSpan={5} className="text-end">Total</TableHead>
                        <TableCell className="text-end text-xl font-semibold">{formatCurrency(salesNote.total_amount + salesNote.delivery_fee + salesNote.tax + salesNote.adjustment - salesNote.discount)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                </TableBody>
            </Table>
            <MultiPricedProductSelect product={multiPricedProduct||undefined} 
                onPriceSelected={onProductPriceSelected} show={multiPricedProduct !== null}
                onClose={()=>setMultiPricedProduct(null)}
                 />
        </>
    )
}