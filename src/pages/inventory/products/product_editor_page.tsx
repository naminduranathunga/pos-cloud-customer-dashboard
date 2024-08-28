import { Button } from "@/components/ui/button";
import ProductCategory from "@/interfaces/product_category";
import {Loader2, Plus, Save, Trash2 } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductEditor from "@/components/inventory/products/ProductEditor";
import { Link, useParams } from "react-router-dom";
import { FullProduct } from "@/interfaces/products";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { useToast } from "@/components/ui/use-toast";
import { SaveProduct } from "@/components/inventory/products/editor/lib_save_product";
import { fetchCategories } from "@/lib/fetch_categories";
import { useConfirm } from "@/components/ui/custom/confirm";


const initialProduct = {
    id: "",
    name: "",
    sku: "",
    prices: [0],
    category: "",
    barcodes: [],
    thumbnail: "",
    weight: 0,
    size: "",
    inventory_type: "nos",
    is_active: true,
} as FullProduct;

async function get_product(jwt: string, product_id: string){
    const resp = await fetch(`${config.apiURL}/product-manager/products/get?id=${product_id}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });

    const products = await resp.json();
    if (products.length === 0){
        throw new Error("Product not found");
    }
    return products[0] as FullProduct;
}

export default function ProductEditorPage() {
    const {productId} = useParams() as {productId?: string};
    const [product, setProduct] = useState<FullProduct|null>(null);
    const [product_categories, setProductCategories] = useState<ProductCategory[]>([]); // ProductCategory[
    const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
    const {toast} = useToast();

    const {
        isLoading,
        get_user_jwt
    } = useFlexaroUser();

    useEffect(() => {
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;
    
        if (productId){

            get_product(jwt, productId).then((product) => {
                setProduct(product);
            }).catch((error) => {
                console.error(error);
                toast({
                    title:"Error!",
                    description: error.message,
                    variant: "destructive",
                })
            });
        } else {
            setProduct({...initialProduct});
        }

        fetchCategories(jwt).then((categories) => {
            setProductCategories(categories);
        }).catch((error) => {
            console.error(error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        });
    }, [productId, isLoading, get_user_jwt]);

    
    const product_ref = useRef<FullProduct | null>(null);


    const update_product_ref = (product:FullProduct)=>{
        product_ref.current = product;
        console.log("product_ref", product_ref.current);
    };

    const onClickSave = useCallback(()=>{
        if (isSavingProduct) return;
        if (!product_ref.current) return;
        setIsSavingProduct(true);

        const jwt = get_user_jwt();
        if (!jwt) return;

        SaveProduct(product_ref.current, jwt).then((data) => {
            
            if (data.message){
                toast({
                    title: "Success",
                    description: data.message,
                });
            }
            if (product_ref.current?.id === ""){
                const newId = data.id;
                // navigate
                window.location.href = `/inventory/products/editor/${newId}`;
            }
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }).finally(()=>{
            setIsSavingProduct(false);
        });

    }, [isSavingProduct, get_user_jwt]);
    
    const onCtrS = useCallback((e:any)=>{
        if (e.ctrlKey && e.key === "s"){
            e.preventDefault();
            onClickSave();
        }
    }, [onClickSave]);

    useEffect(()=>{
        window.addEventListener("keydown", onCtrS);
        return ()=>{
            window.removeEventListener("keydown", onCtrS);
        }
    }, [onCtrS]);

    const { Confirm } = useConfirm();

    const DeleteConfirmResponse = useCallback((confirmed:boolean)=>{
        if (!confirmed) return;

        const jwt = get_user_jwt();
        fetch(`${config.apiURL}/product-manager/products/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((resp)=>{
            if (resp.ok){
                toast({
                    title: "Success",
                    description: "Product deleted successfully"
                });
                window.location.href = "/inventory/products/";
            } else {
                throw new Error("Failed to delete product");
            }
        }).catch((error)=>{
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        });
    }, [get_user_jwt, toast])
    const OnClickDelete = useCallback(()=>{
        Confirm("Delete Product", "Are you sure you want to delete this product?", "destructive", DeleteConfirmResponse);
    }, [Confirm]);
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">{ productId ? "Edit Product": "Create New Product"}</h1>
                
                <Link to={'/inventory/products/editor/'} reloadDocument={true}  className="ms-auto">
                    <Button className="flex items-center gap-2" variant={"outline"} > <Plus size={"1em"} /> New Product</Button>
                </Link>
                { (product && product.id)  && 
                <Button className="flex items-center gap-2" variant={"destructive"} onClick={OnClickDelete} > 
                    <Trash2 size={"1em"} /> Delete  {isSavingProduct && <Loader2 size={"1em"} className="animate-spin" />}
                </Button>}
                <Button className="flex items-center gap-2" title="Ctrl + S" onClick={onClickSave} > <Save size={"1em"} /> Save  {isSavingProduct && <Loader2 size={"1em"} className="animate-spin" />}</Button>
                
            </header>


            <div className="grid grid-cols-1 gap-6">
                {(product == null) ? <p>Loading...</p> : <ProductEditor product={product} onChange={update_product_ref} categories={product_categories} /> }
            </div>

        </div>
    )
}