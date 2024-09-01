import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { ProductSimple } from "@/interfaces/products"
import { useEffect, useRef, useState } from "react"


  export default function MultiPricedProductSelect({product, onPriceSelected, show, onClose}:{
    product?:ProductSimple, 
    onPriceSelected:(product:ProductSimple, priceIndex:number)=>void, 
    show:boolean,
    onClose:()=>void
}){
    const [priceIndex, setPriceIndex] = useState(0);
    const ulRef = useRef<HTMLUListElement>(null);

    useEffect(()=>{
        setPriceIndex(0);
        if (ulRef.current){
            ulRef.current.focus();
        }
    }, [product, show]);
    useEffect(()=>{
        const handleKeyDown = (e:KeyboardEvent) => {
            if (!show) return;
            if (!product) return;

            if (e.key === "Escape"){
                e.preventDefault();
                onClose();
                return;
            } else if (e.key === "Enter"){
                //product && onPriceSelected(product, priceIndex);
                //onClose();
                e.preventDefault();
                console.log("Enter");
                return;
            } else if (e.key === "ArrowDown"){
                e.preventDefault();
                console.log("ArrowDown", (priceIndex+1) % product.prices.length);
                setPriceIndex((priceIndex+1) % product.prices.length);
            } else if (e.key === "ArrowUp"){
                e.preventDefault();
                console.log("ArrowUp", (priceIndex-1) % product.prices.length);
                setPriceIndex((priceIndex-1) % product.prices.length);
            }
        }
        const ulRef_ = ulRef.current;
        ulRef_?.addEventListener("keydown", handleKeyDown);

        return ()=>{
            ulRef_?.removeEventListener("keydown", handleKeyDown);
        }
        // eslint-disable-next-line
    }, [show, product, priceIndex, ulRef.current, onClose]);
    return (
        <Dialog open={show} onOpenChange={(state)=>{ (state === false) && onClose() }}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Select the product price for {product?.name}.</DialogTitle>
                <DialogDescription>
                    <ul ref={ulRef} className="divide-y h-56 overflow-auto border mt-6 rounded-md shadow-inner" tabIndex={1}>
                        {
                            product?.prices.map((price, index)=>{
                                return (
                                    <li key={index} onClick={()=>{onPriceSelected(product!, index); onClose()}} className={`px-4 py-2 hover:bg-green-100 transition duration-150 cursor-pointer ${priceIndex === index ? "bg-green-200": ""}`}>LKR {price}</li>
                                )
                            })
                        }
                        
                    </ul>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}