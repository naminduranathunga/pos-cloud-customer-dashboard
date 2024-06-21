import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductCategory from "@/interfaces/product_category";
import { useCallback, useState } from "react";
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
import { CompanyBranch } from "@/interfaces/company";

export default function CompanyBranchEditor({_id, branch, with_trigger, onSave, onCancel, onClose}:
    {   
        _id?: string,
        branch: CompanyBranch, 
        with_trigger: boolean,
        onSave?: (category: ProductCategory) => void, 
        onCancel?: () => void
        onClose?: () => void
    }) {
        let phone_txt = branch.phone.join("\n");
        
        const [bName, setBName] = useState(branch.name);
        const [bEmail, setBEmail] = useState(branch.email);
        const [bAddress, setBAddress] = useState(branch.address);
        const [bPhone, setBPhone] = useState<string>(phone_txt);
        const [is_updating, setIsLoading] = useState(false);
        const {toast} = useToast();
        const { isLoading, get_user_jwt } = useFlexaroUser();

        const onOpenChange = useCallback((open:boolean) => {
            if (!open && onClose) onClose();
        }, [onClose]);

        const saveBranch = useCallback(()=>{
            if (isLoading || is_updating) return;

            if (!bName || !bEmail || !bAddress || !bPhone) {
                toast({
                    title: "Error",
                    description:"All fields are required",
                    variant: "destructive"
                });
                return;
            }
            const jwt = get_user_jwt();
            if (!jwt) {
                toast({
                    title: "Error",
                    description: "You are not authorized to perform this action",
                    variant: "destructive"
                });
                return;
            }

            setIsLoading(true);

            fetch(`${config.apiURL}/company/branch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: bName,
                    email: bEmail,
                    address: bAddress,
                    phone: bPhone.split("\n"),
                    _id: _id
                })
            }).then((res)=>{
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Failed to save branch");
                }
            }).then((data)=>{
                if (onSave) onSave(data);
                toast({
                    title: "Success",
                    description: "Branch saved successfully",
                });
            }).catch((err)=>{
                toast({
                    title: "Error",
                    description: err.message,
                    variant: "destructive"
                });
            }).finally(()=>{
                setIsLoading(false);
            });



        }, [bName, bEmail, bAddress, bPhone, is_updating, isLoading, get_user_jwt, toast]);
        
        return (

            <Dialog defaultOpen={(!with_trigger)} onOpenChange={onOpenChange}>
                {with_trigger && <DialogTrigger>Open</DialogTrigger>}
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>{ branch._id ? "Edit Branch" : "New Branch" }</DialogTitle>
                    <DialogDescription>
                    <div className="max-w-[400px]">

                        <div className="mb-6 flex flex-col gap-2">
                            <Label>Name:</Label>
                            <Input value={bName} onChange={(e) => {setBName(e.target.value)}} />
                        </div>
                        <div className="mb-6 flex flex-col gap-2">
                            <Label>Email:</Label>
                            <Input value={bEmail} onChange={(e) => {setBEmail(e.target.value)}} />
                        </div>
                        
                        <div className="mb-6 flex flex-col gap-2">
                            <Label>Address:</Label>
                            <Input value={bAddress} onChange={(e) => {setBAddress(e.target.value)}} />
                        </div>

                        <div className="mb-6 flex flex-col gap-2">
                            <Label>Phone:</Label>
                            <Input value={bPhone} onChange={(e) => {setBPhone(bPhone)}} />
                        </div>

                        <div className="flex gap-4">
                            <Button className="flex items-center" onClick={()=>{}}>
                                <span>Save</span>
                                {is_updating && <Loader2 className="animate-spin ms-2" size={20} />}
                            </Button>
                            { branch._id && <Button variant={"outline"}>Delete</Button>}
                        </div>
                    </div>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            
        )   
}