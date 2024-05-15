import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductBarcodeEditor from "./editor/BarcodeEditor";
import { useState } from "react";
import ProductEditorInventorySummary from "./editor/ProductInventoryTable";
import { ProductCategorySelector } from "../category/ProductCategorySelector";


export default function ProductEditor(){
    const [barcodes, setBarcodes] = useState<string[]>([]);

    return (
        <div className="pb-12">
            <div className="flex gap-6">
                <div className="w-[50%] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Product Name<span className="text-red-500">*</span></Label>
                        <Input type="text" />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>SKU<span className="text-red-500">*</span></Label>
                        <Input type="text" />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Inventory Type<span className="text-red-500">*</span></Label>
                        <select className="border px-4 py-2 rounded-md">
                            <option value="nos">NOS</option>
                            <option value="kg">NOS</option>
                        </select>
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Product Category:</Label>
                        <ProductCategorySelector categories={[]} />
                    </div>


                    <h3 className="text-lg font-semibold mb-4 mt-12">Product Dimentions</h3>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Weight</Label>
                        <Input type="number" value={0} />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Size</Label>
                        <Input type="number" value={0} />
                    </div>

                    
                </div>
                <div className="w-[50%]">

                    <div className="mb-8 flex flex-col ">
                        <div className="mb-2 flex items-center justify-start gap-2">
                            <input type="checkbox" className="w-5 h-5 rounded-md border border-gray-300" id="is_product_active" />
                            <Label htmlFor="is_product_active">Is Active</Label>
                        </div>
                        <span className=" text-gray-500 text-sm">Only the active products will be synced to the POS applications in your store.</span>
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                        <Label>Product Thumbnail:</Label>
                        <img src="/logo512.png" className="w-52 aspect-square object-center object-cover" alt="Product image" />
                        <span className=" text-gray-500 text-sm">The thumbnail will be shown in your POS application. use 250*250 image less than 512KB.</span>
                    </div>
                </div>
            </div>


            
            <div className="flex gap-6 mt-12">
                <div className="w-[50%] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Barcodes</h3>
                    <ProductBarcodeEditor barcodes={barcodes} onChange={setBarcodes} />
                    <span className=" text-gray-500 text-sm">Use the barcode Generator to create a custom barcode for the product.</span>
                </div>
            </div>
            
            <div className="flex gap-6 mt-12">
                <div className="w-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Inventory</h3>
                    <ProductEditorInventorySummary />
                </div>
            </div>
        </div>
        
    );
}