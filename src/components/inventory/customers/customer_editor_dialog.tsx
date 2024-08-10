import { useCallback, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import config from "@/lib/config";
import CustomerInterface from "@/interfaces/inventory/customer";

export default function CustomerEditorDialog({customer, onclose, onsave, with_trigger}: {customer: CustomerInterface, onclose: () => void, onsave: (customer: CustomerInterface) => void, with_trigger?: boolean}){
    const [customerState, setVendorState] = useState<CustomerInterface>(customer);
    const [is_updating_server, setIsUpdatingServer] = useState(false);
    const {toast} = useToast();
    const { isLoading, get_user_jwt } = useFlexaroUser();
    
    const saveVendor = useCallback(() => {
        if (is_updating_server) return;
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        //validate
        if (customerState.name.trim() === "") {
            toast({
                title: "Name is required",
                variant: "destructive"
            });
            return;
        }
        if (customerState.phone.trim() === "") {
            toast({
                title: "Phone is required",
                variant: "destructive"
            });
            return;
        }

        setIsUpdatingServer(true);
        let url = "";
        if (customerState.id){
            url = `${config.apiURL}/inventory-manager/customers/update`;
        } else {
            url = `${config.apiURL}/inventory-manager/customers/create`;
        }

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(customerState),
        }).then(resp => {
            if (resp.ok){
                return resp.json().then((data: any) => {
                    toast({
                        title: "Vendor saved",
                    });
                    onsave({...customerState, id:data.id});
                });
            } else {
                toast({
                    title: "Failed to save customer",
                    variant: "destructive"
                });
            }
        }).catch(err => {
            toast({
                title: "Failed to save customer",
                variant: "destructive"
            });
            console.error(err);
        }).finally(() => {
            setIsUpdatingServer(false);
        });

    }, [customerState, is_updating_server, isLoading, get_user_jwt, onsave, toast]);

    const onOpenChange = useCallback((open:boolean) => {
        if (!open && onclose) onclose();
    }, [onclose]);

    if (typeof with_trigger === "undefined") with_trigger = false;

    useEffect(()=>{
        setVendorState(customer);
    }, [customer]);

    return (
        <Dialog defaultOpen={(!with_trigger)} onOpenChange={onOpenChange}>
            {with_trigger && <DialogTrigger>Open</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{ customerState.id ? "Edit Vendor" : "New Vendor" }</DialogTitle>
                <DialogDescription>
                <div className="max-w-[400px] pt-8">

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Name </Label>
                        <Input value={customerState.name} onChange={(e) => {
                            setVendorState({...customerState, name: e.target.value});
                        }} />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Email </Label>
                        <Input value={customerState.email} onChange={(e) => {
                            setVendorState({...customerState, email: e.target.value});
                        }} />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Phone </Label>
                        <Input value={customerState.phone} onChange={(e) => {
                            setVendorState({...customerState, phone: e.target.value});
                        }} />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <Label> Address </Label>
                        <Input value={customerState.address} onChange={(e) => {
                            setVendorState({...customerState, address: e.target.value});
                        }} />
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex items-center" onClick={saveVendor}>
                            <span>Save</span>
                            {is_updating_server && <Loader2 className="animate-spin ms-2" size={20} />}
                        </Button>
                    </div>
                </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}