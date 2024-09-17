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
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import config from "@/lib/config";
import has_user_permissions from "@/lib/has_permissions";

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
        const [is_updating_server, setIsLoading] = useState(false);
        const {toast} = useToast();
        const { get_user_jwt, user } = useFlexaroUser();

        if (typeof with_trigger === "undefined") with_trigger = true;
        const onOpenChange = useCallback((open:boolean) => {
            if (!open && onClose) onClose();
        }, [onClose]);

        const saveCategory = ()=>{
            if (is_updating_server) return;

            if (!cName){
                toast({title: "Category name is required", variant: "destructive"});
                return;
            }

            setIsLoading(true);

            fetch(`${config.apiURL}/product-manager/product-category/${category.id ? "update" : "create"}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${get_user_jwt()}`
                },
                body: JSON.stringify({
                    id: category.id,
                    name: cName,
                    parent_id: parent
                })
            }).then((resp)=>{
                if (resp.ok){
                    return resp.json();
                }else {
                    throw new Error("Failed to save category");
                }
            }).then((data)=>{
                const new_category: ProductCategory = {
                    id: data._id,
                    name: data.name,
                    parent: data.parent
                };
                if (onSave) onSave(new_category);
                setIsLoading(false);
            }).catch((error)=>{
                setIsLoading(false);
                toast({title: "Failed to save category", variant: "destructive"});
            });
        }

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
                            <ProductCategorySelector categories={category_list} onChange={(new_parent)=>{
                                console.log("Parent changed", new_parent);
                                setParent(new_parent);
                            }} value={parent} />
                        </div>

                        <div className="flex gap-4">
                            <Button className="flex items-center" onClick={saveCategory}>
                                <span>Save</span>
                                {is_updating_server && <Loader2 className="animate-spin ms-2" size={20} />}
                            </Button>
                            { category.id && has_user_permissions(user, ['delete_product_category']) && <Button variant={"outline"}>Delete</Button>}
                        </div>
                    </div>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            
        )   
}