import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Barcode, X } from "lucide-react";
import { RefObject, useCallback, useRef, useState } from "react";

function DownloadBarcodes({barcodes}:{barcodes: string[]}){
    const joined = barcodes.join("\n");

    return (
        <div>
            { barcodes.map((barcode, i)=><img key={i} src={`https://barcode.tec-it.com/barcode.ashx?data=${barcode}&code=Code128&translate-esc=on`} alt={barcode} />)}
            <div style={
                {
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "15px",
                    fontFamily: "Source Sans Pro, Arial, sans-serif"
                }}><a rel="noopener" href='https://www.tec-it.com' title='Barcode Software by TEC-IT' target='_blank'>TEC-IT Barcode Generator</a>
            </div>
        </div>
    )
}


export default function ProductBarcodeEditor({barcodes, onChange}:{barcodes: string[], onChange?: (barcodes: string[]) => void}){
    const barcodeRef = useRef(null);
    const [showEditor, setShowEditor] = useState<boolean>(false);

    const AddBarcode = useCallback(()=>{
        if (!barcodeRef.current) return;
        const barcode = (barcodeRef.current as HTMLInputElement).value.trim();
        if (!barcode) return;
        if (barcodes.includes(barcode)) return;
        var b = [...barcodes];
        b.push(barcode);
        console.log(JSON.stringify(b));
        if (onChange) onChange(b);
        (barcodeRef.current as HTMLInputElement).value = "";
        setTimeout((barcodeRef:RefObject<any>)=>{
            if (barcodeRef.current)
                (barcodeRef.current as HTMLInputElement).focus();
        }, 100, barcodeRef);
    }, [barcodeRef, barcodes, onChange]);

    const OnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === "Enter"){
            e.preventDefault();
            AddBarcode();
        }
    }, [AddBarcode]);

    const RemoveBarcode = useCallback((barcode:string)=>{
        if (onChange) onChange(barcodes.filter((b)=>b !== barcode));
    }, [onChange, barcodes]);

    return (
        <div>
            <ul className="divide-y">
                { barcodes.map((barcode, i)=><li key={i} className="flex items-center justify-between gap-2">
                    <div>{barcode}</div>
                    <Button variant={"link"} onClick={()=>{RemoveBarcode(barcode);}}> <X size={"1.2em"} /> </Button>
                </li>)}
                
                { barcodes.length === 0 && 
                <li className="text-gray-500 text-center py-4 flex flex-col items-center">
                    <Barcode size={"2em"} />
                    No barcodes added
                </li>}
            </ul>
            {barcodes.length < 3 && 
            <div  className="mt-6 py-2 flex items-center justify-between gap-2" key={barcodes.length}>
                <Input type="text" onKeyDown={OnKeyDown} ref={barcodeRef} placeholder="Scan or type the barcode" />
                <Button onClick={()=>{AddBarcode()}}>Add</Button>
            </div>}
            <div>
                <p className="text-sm text-gray-500 mb-6"><button role="button" type="button" onClick={()=>{setShowEditor(!showEditor)}} className="text-green-600 hover:underline">Click here</button> to generate and download barcodes as images.</p>
                {showEditor && <>
                    <DownloadBarcodes barcodes={barcodes} />
                    </>
                }
            </div>
        </div>
    )
}