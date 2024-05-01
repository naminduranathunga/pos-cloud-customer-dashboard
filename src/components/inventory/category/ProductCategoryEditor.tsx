import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductCategory from "@/interfaces/product_category";
import { useCallback, useState } from "react";
import { ProductCategorySelector } from "./ProductCategorySelector";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

export default function ProductCategoryEditor({category, category_list, with_trigger, onSave, onCancel, onClose}:
    {
        category: ProductCategory, 
        category_list:ProductCategory[], 
        with_trigger?: boolean,
        onSave?: (category: ProductCategory) => void, 
        onCancel?: () => void
        onClose?: () => void
    }) {
        
        const [cName, setCName] = useState(category.name);
        const [parent, setParent] = useState(category.parent?.id || "");

        if (typeof with_trigger === "undefined") with_trigger = true;
        const onOpenChange = useCallback((open:boolean) => {
            if (!open && onClose) onClose();
        }, [onClose]);

        return (

            <Dialog defaultOpen={(!with_trigger)} onOpenChange={onOpenChange}>
                {with_trigger && <DialogTrigger>Open</DialogTrigger>}
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>{ category.id ? "Edit Category" : "New Category" }</DialogTitle>
                    <DialogDescription>
                    <div className="max-w-[400px]">

                        <div className="mb-6 flex flex-col gap-2">
                            <Label> Name </Label>
                            <Input value={cName} onChange={(e) => {setCName(e.target.value)}} />
                        </div>
                        
                        <div className="mb-6 flex flex-col gap-2">
                            <Label> Parent </Label>
                            <ProductCategorySelector />
                        </div>

                        <div className="flex gap-4">
                            <Button>Save</Button>
                            <Button variant={"outline"}>Delete</Button>
                        </div>
                    </div>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            
        )   
}