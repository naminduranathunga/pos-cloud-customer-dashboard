import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast";
import { ProductSimple } from "@/interfaces/products";
import config from "@/lib/config";
import { BarcodeScannerEvent } from "@/lib/hooks/barcode_scanner";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react"

const TypingDelay = 1000;

function can_be_a_barcode(text:string){
    // no spaces or special characters
    if (text.match(/[^\x00-\x7F]/)) return false;
    if (text.length < 6) return false;
    return true;
}

async function get_search_suggesions(jwt:string, searchTerm:string){
    const res = await fetch(`${config.apiURL}/product-manager/products/get?per_page=25&search_term=${encodeURI(searchTerm)}`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    let product_list:ProductSimple[] = [];
    if (res.ok){
        product_list = (await res.json()) as ProductSimple[];
    }else{
        throw new Error("Error getting products");
    }
    // barcode match
    if (can_be_a_barcode(searchTerm) && product_list.length === 0){
        const res2 = await fetch(`${config.apiURL}/product-manager/products/get?per_page=1&barcode=${encodeURI(searchTerm)}`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });
        if (res2.ok){
            const bcp = (await res2.json()) as ProductSimple[];
            if (bcp.length > 0){
                product_list.push(bcp[0]);
            }
        }else{
            throw new Error("Error getting products");
        }
    }
    return product_list;
}


export default function ProductSearchBox({onAddProduct}:{onAddProduct:Function}){
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<Array<ProductSimple>>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastKeyInput = useRef<number>(0);
    const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
    const {isLoading, get_user_jwt} = useFlexaroUser();
    const {toast} = useToast();
    const [is_loading_something, setIsLoadingSomething] = useState(false);
    
    const getSearchSuggesions = useCallback((searchTerm:string)=>{
        if (isLoading) return;
        const jwt = get_user_jwt();
        if (!jwt) return;

        setIsLoadingSomething(true);
        get_search_suggesions(jwt, searchTerm).then((value)=>{
            setSuggestions(value);
            setSelectedSuggestion(-1);
        }).catch((error:Error)=>{
            //ignore
            console.error(error);
        }).finally(()=>{
            setIsLoadingSomething(false);
        });

    }, [isLoading, get_user_jwt, searchTerm]);

    const AddGRNProduct = useCallback((product?:ProductSimple)=>{
        if (product ){
            onAddProduct(product);
            setSearchTerm("");
            setSuggestions([]);
            setSelectedSuggestion(-1);
            return;
        }

        if (!inputRef.current) return;
        // empty text? no
        const value = inputRef.current.value;   
        if (value.length === 0) return;
        
        // check if the product already exists in the suggestions
        product = suggestions.find((p)=>(p.name === value || p.barcodes?.includes(value)));
        if (product){
            onAddProduct(product);
            setSearchTerm("");
            setSuggestions([]);
            setSelectedSuggestion(-1);
            return;
        }

        //if (isLoading) return; -- no need to check this
        const jwt = get_user_jwt();
        if (!jwt) return;

        setIsLoadingSomething(true);
        get_search_suggesions(jwt, searchTerm).then((value)=>{
            if (value.length > 0){
                onAddProduct(value[0]);
                setSearchTerm("");
                setSuggestions([]);
                setSelectedSuggestion(-1);
                return;
            }
            else {
                toast({
                    "title": "Product not found",
                });
            }
        }).catch((error:Error)=>{
            //ignore
            console.error(error);
        }).finally(()=>{
            setIsLoadingSomething(false);
        });

    }, [onAddProduct, inputRef, suggestions]);

    
    const onKeyDown = useCallback((e:KeyboardEvent)=>{
        if (e.key == "Enter"){
            // if something is selected, add it
            if (selectedSuggestion > -1){
                AddGRNProduct(suggestions[selectedSuggestion]);
            }else {
                AddGRNProduct();
            }
        } else if (e.key == "ArrowDown"){
            e.preventDefault();
            if (suggestions.length === 0) return;
            if (suggestions.length > selectedSuggestion + 1){
                setSelectedSuggestion(selectedSuggestion + 1);
            }else {
                setSelectedSuggestion(0);
            }
            
        } else if (e.key === "ArrowUp"){
            e.preventDefault();
            if (suggestions.length === 0) return;
            if (selectedSuggestion > 0){
                setSelectedSuggestion(selectedSuggestion - 1);
            }else {
                setSelectedSuggestion(suggestions.length - 1);
            }
        } else {
            lastKeyInput.current = (new Date).getTime();
            setTimeout(()=>{
                // check 
                if ((new Date).getTime() - lastKeyInput.current > TypingDelay){
                    const s = inputRef.current?.value;
                    if (s && s.length > 2) getSearchSuggesions(s);
                }
            }, TypingDelay);
        }
    }, [lastKeyInput, suggestions, selectedSuggestion, AddGRNProduct]);

    useEffect(()=>{
        if (!inputRef.current) return;
        inputRef.current.addEventListener("keydown", onKeyDown);
        document.addEventListener("barcode_scanned", (e:Event)=>{
            const ee = e as BarcodeScannerEvent;
            if (inputRef.current && inputRef.current.value.length === 0){
                inputRef.current.value = ee.barcode;
                AddGRNProduct();
            }
        });
        return ()=>{
            inputRef.current?.removeEventListener("keydown", onKeyDown);
        }
    }, [inputRef, onKeyDown])


    return (
        <div className="flex w-full min-w-[400px]">
            <div className="relative w-full">
                <Input value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}} ref={inputRef} placeholder="Search product by name or scan the barcode" />
                <div className="search-suggesions absolute top-full bg-white border rounded shadow-md w-full  px-0 text-start max-h-96 overflow-y-auto z-20">
                    <ul>
                        {
                            suggestions.map((product, index)=>(
                                <li key={index} className={"py-1.5 px-2.5 cursor-pointer hover:bg-green-100" + ((selectedSuggestion === index)?" bg-green-200":"")} onClick={()=>{
                                    AddGRNProduct(product);
                                }}>{product.name}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="h-full w-8 absolute top-0 right-0 flex items-center justify-center text-gray-500 pointer-events-none">
                    <Loader2 size={"1em"} className={"animate-spin" + (is_loading_something?"":" hidden")} />
                </div>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md ms-4" onClick={()=>{AddGRNProduct()}}>Add</button>
        </div>
    )
}