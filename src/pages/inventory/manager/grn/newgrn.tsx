import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Save } from "lucide-react";
import GRNProductTable from "@/components/inventory/inventory_manager/grn_product_table";
import { useState } from "react";
import { GRNSingle, GRNProduct } from "@/interfaces/inventory/grn";

const sample_products:GRNProduct[] = [
    {
        id: 1,
        product: {
            id: "1",
            name: "Product 1"
        },
        cost_price: 100,
        sales_price: 120,
        quantity: 10
    },
    {
        id: 2,
        product: {
            id: "2",
            name: "Product 2"
        },
        cost_price: 200,
        sales_price: 220,
        quantity: 20
    },
    {
        id: 3,
        product: {
            id: "3",
            name: "Product 3"
        },
        cost_price: 300,
        sales_price: 320,
        quantity: 30
    },
]

function createNewGRN(){
    // Create new GRN
    return {
        grn_number: -1,
        vendor: "v1",
        date: new Date().toISOString(),
        invoice_no: "string",
        status: "draft",
        products: sample_products,
        attachments: [],
        branch: "",
        invoice_value: 0,
        total: "",
        adjusted_total: 0,
        notes: ""
    } as unknown as GRNSingle;
}

export default function CreateNewGRNPage(){
    const [grn, setGRN] = useState<GRNSingle>(createNewGRN());
    const [grnProductList, setGRNProductList] = useState<GRNProduct[]>(sample_products);
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">New Good Received Note</h1>

                <Button className="flex items-center gap-2 ms-auto" > <Save size={"1em"} /> Save</Button>
            </header>


            <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_no" className="text-nowrap">GRN No.:</Label>
                        <Input id="grn_no" value={grn.grn_number} disabled/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_date" className="text-nowrap">Date:</Label>
                        <Input id="grn_date" type="date" value={grn.date} onChange={(e)=>{
                            setGRN({ ...grn, date: e.target.value } as GRNSingle)
                        }}/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_invoice_no" className="text-nowrap">Invoce No.:</Label>
                        <Input id="grn_invoice_no" type="text" value={grn.invoice_no} onChange={(e)=>{
                            setGRN({ ...grn, invoice_no: e.target.value } as GRNSingle)
                        }}/>
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_vendor" className="text-nowrap">Vendor:</Label>
                        <Input id="grn_vendor" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_branch" className="text-nowrap">Branch:</Label>
                        <Input id="grn_branch"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_invoice_value" className="text-nowrap">Invoce Value:</Label>
                        <Input id="grn_invoice_value" type="text" value={0}/>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="attachments" className="text-nowrap">Attachments:</Label>
                        <Input id="attachments" type="file"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="grn_ex_notes" className="text-nowrap">Notes:</Label>
                        <textarea className="w-full border rounded" rows={4}></textarea>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-1 gap-6">
                <GRNProductTable data={grn.products} onChange={(plist:GRNProduct[])=>{setGRN({
                    ...grn,
                    products: plist
                } as GRNSingle)}}/>
            </div>

            <div className="flex justify-end py-8">
                <div className="p-4 bg-gray-100 rounded ">
                    <table className="text-xl">
                        <tr>
                            <td>
                                Product Total:
                            </td>
                            <td> Rs. 12,000.00</td>
                        </tr>
                        
                        <tr>
                            <td>
                                Invoice Total:
                            </td>
                            <td> Rs. 12,000.00</td>
                        </tr>
                        
                        <tr>
                            <td>
                                Balance:
                            </td>
                            <td> Rs. 0.00</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}