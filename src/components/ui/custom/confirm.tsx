import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useCallback, useContext, useState, createContext, useEffect } from "react";
import { Button } from "../button";

interface ConfirmContextType {
    Confirm: (
        title:string, 
        description:string, 
        variant:"destructive" | "informative" | "none",
        callback?:(confirmed: boolean)=>void
    )=>void;
}

const ConfirmContext = createContext<ConfirmContextType|null>(null);


export function useConfirm(): ConfirmContextType{
    const context = useContext(ConfirmContext);
    if (!context){
        throw new Error("useConfirm must be used within a ConfirmDialogProvider");
    }
    return context;
}




export function ConfirmDialogProvider({children}:{children:React.ReactNode}){
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState("");
    const [variant, setVariant] = useState<"destructive" | "informative" | "none">("informative");
    const [callback, setCallback] = useState<((confirmed: boolean)=>void)|null>(null);

    const Confirm = useCallback((title:string, description:string, variant: "destructive" | "informative"| "none" = "informative", callback?:(confirmed: boolean)=>void)=>{
        setTitle(title);
        setDescription(description);
        setVariant(variant);
        setCallback((()=>callback )|| null);
        setIsOpen(true);
    }, []);


    return (
        <ConfirmContext.Provider value={{Confirm}} >
            {children}
            <Dialog open={isOpen} onOpenChange={(open)=>{setIsOpen(open); if (callback) callback(false);}}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription> {description} </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant={"secondary"} onClick={()=>{setIsOpen(false); if (callback) callback(false)}}>Cancel</Button>
                        <Button variant={"default"} onClick={()=>{setIsOpen(false); if (callback) callback(true)}} className="px-8">Ok</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmContext.Provider>
    );
}

/**
 * Usage:
 
const {Confirm} = useConfirm();
Confirm("Delete Product", "Are you sure you want to delete this product?", "destructive", (confirmed)=>{})
 */