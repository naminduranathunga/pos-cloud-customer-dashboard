import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductBarcodeEditor from "./editor/BarcodeEditor";
import { ForwardedRef, Ref, RefObject, useEffect, useState } from "react";
import ProductEditorInventorySummary from "./editor/ProductInventoryTable";
import { ProductCategorySelector } from "../category/ProductCategorySelector";
import { FullProduct } from "@/interfaces/products";
import ProductThumbnailEditor from "./editor/ProductThumbnailEditor";
import ProductCategory from "@/interfaces/product_category";


export default function ProductEditor({product, categories, onChange}:{product:FullProduct, categories:ProductCategory[], onChange: (product:FullProduct)=>void}){
    const [barcodes, setBarcodes] = useState<string[]>(product.barcodes);
    const [pname, setPname] = useState<string>(product.name);
    const [sku, setSku] = useState<string>(product.sku);
    const [category, setCategory] = useState<string>(product.category);
    const [weight, setWeight] = useState<number>(product.weight);
    const [size, setSize] = useState<string>(product.size);
    const [inventory_type, setInventoryType] = useState<string>(product.inventory_type);
    const [is_active, setIsActive] = useState<boolean>(product.is_active);
    const [thumbnail, setThumbnail] = useState<string>(product.thumbnail);
    
    useEffect(()=>{
        onChange({
            ...product,
            name: pname,
            sku: sku,
            category: category,
            weight: weight,
            size: size,
            inventory_type: inventory_type,
            is_active: is_active,
            thumbnail: thumbnail,
            barcodes: barcodes
        })
    }, [pname, sku, category, weight, size, inventory_type, is_active, thumbnail, barcodes])
    

    return (
        <div className="pb-12">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-[50%] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Product Name<span className="text-red-500">*</span></Label>
                        <Input type="text" value={pname} onChange={(e)=>{setPname(e.target.value)}} />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>SKU<span className="text-red-500">*</span></Label>
                        <Input type="text" value={sku} onChange={(e)=>setSku(e.target.value)}/>
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Inventory Type<span className="text-red-500">*</span></Label>
                        <select className="border px-4 py-2 rounded-md" value={inventory_type} onChange={(e)=>setInventoryType(e.target.value)}>
                            <option value="nos">NOS</option>
                            <option value="kg">Kg</option>
                            <option value="cm">cm</option>
                            <option value="cm">ml</option>
                        </select>
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Product Category:</Label>
                        <ProductCategorySelector categories={categories} value={category} onChange={setCategory} />
                    </div>


                    <h3 className="text-lg font-semibold mb-4 mt-12">Product Dimentions</h3>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Weight</Label>
                        <Input type="number" value={weight}  onChange={(e)=>{setWeight(parseInt(e.target.value))}}  />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Size</Label>
                        <Input type="text" placeholder="L,XL,Small,etc." value={size}  onChange={(e)=>{setSize(e.target.value)}} />
                    </div>

                    
                </div>
                <div className="w-full lg:w-[50%]">

                    <div className="mb-8 flex flex-col ">
                        <div className="mb-2 flex items-center justify-start gap-2">
                            <input type="checkbox" className="w-5 h-5 rounded-md border border-gray-300" id="is_product_active" checked={is_active}  onChange={(e)=>{setIsActive(e.target.checked)}} />
                            <Label htmlFor="is_product_active">Is Active</Label>
                        </div>
                        <span className=" text-gray-500 text-sm">Only the active products will be synced to the POS applications in your store.</span>
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Product Thumbnail:</Label>
                        {product._id ? <ProductThumbnailEditor product_id={product._id} thumbnail={thumbnail} setThumbnail={setThumbnail} />
                        : <div className="bg-gray-100 w-full h-[200px] flex items-center justify-center rounded-md">Save the product before add a thumbnail.</div>}
                    </div>
                </div>
            </div>


            
            <div className="flex gap-8 mt-12">
                <div className="w-full lg:w-[50%] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Barcodes</h3>
                    <ProductBarcodeEditor barcodes={barcodes} onChange={setBarcodes} />
                    <span className=" text-gray-500 text-sm">Use the barcode Generator to create a custom barcode for the product.</span>
                </div>
                <div></div>
            </div>
            
            <div className="flex gap-8 mt-12">
                <div className="w-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Inventory</h3>
                    <ProductEditorInventorySummary />
                </div>
                <div></div>
            </div>
        </div>
        
    );
}