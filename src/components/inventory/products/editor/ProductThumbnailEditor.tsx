import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { DragEvent, useCallback, useEffect, useRef, useState } from "react";


export default function ProductThumbnailEditor({thumbnail, setThumbnail, product_id}:{thumbnail:string, setThumbnail?:Function, product_id:string}){
    let img_src = "/logo512.png";
    if (thumbnail){
        img_src = `${config.apiURL}/product-manager/products/get-thumbnail?image_file=${thumbnail}`;
    }

    const uploaderRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const dropFileRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [is_waiting_for_upload, setIsWaitingForUpload] = useState<boolean>(false);
    const [is_uploading, setIsUploading] = useState<string>("");
    const {isLoading, get_user_jwt} = useFlexaroUser();

    const OnChangeImage = useCallback(() =>{
        if (!uploaderRef.current || !uploaderRef.current.files) return;

        const file = uploaderRef.current.files[0];
        if (!file) return;

        if (!config.product_thumbnail.supported_types.includes(file.type)){
            toast({
                title: "Invalid file type",
                description: "Supported types are: " + config.product_thumbnail.supported_types.join(", "),
                variant: "destructive"
            });
            return;
        }

        if (file.size > config.product_thumbnail.max_size){
            toast({
                title: "File too large",
                description: "Maximum file size is " + (config.product_thumbnail.max_size / 1024) + " Kbytes",
                variant: "destructive"
            });
            return;
        }

        // show preview
        const reader = new FileReader();
        reader.onload = function(e){
            if (imageRef.current){
                imageRef.current.src = e.target?.result as string;
                imageRef.current.style.opacity = "1";
            }
        }
        reader.readAsDataURL(file);
        setIsWaitingForUpload(true);

    }, [uploaderRef]);
    
    const upload_image = useCallback(()=>{
        if (!uploaderRef.current || !uploaderRef.current.files) return;
        const file = uploaderRef.current.files[0];
        if (!file) return;
        if (isLoading) return;
        setIsUploading("Uploading...");
        setIsWaitingForUpload(false);

        const jwt = get_user_jwt();
        const formData = new FormData();
        formData.append("thumbnail", file);
        formData.append("product_id", product_id);
        
        fetch(`${config.apiURL}/product-manager/products/add-thumbnail`, {
            headers:{
                "Authorization": `Bearer ${jwt}`
            },
            method: "POST",
            body: formData
        }).then((resp) => {
            if (resp.ok){
                return resp.json();
            } else {
                resp.json().then((data) => {
                    throw new Error(data.message);
                });
            }
        }).then((data) => {
            if (setThumbnail){
                setThumbnail(data.thumbnail);
            }
            setIsUploading("");
        }).catch((error) => {
            console.error(error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
            setIsUploading("");
        }
    );

    }, [uploaderRef, isLoading]);
    

    const remove_thumbnail = useCallback(()=>{
        if (isLoading) return;

        if (!window.confirm("Do you really want to remove it?")) return;
        setIsUploading("Removing...");

        const jwt = get_user_jwt();
        fetch(`${config.apiURL}/product-manager/products/remove-thumbnail`, {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id 
            })
        }).then((resp)=>{
            if (resp.ok){
                //
                setIsUploading("");
                if (setThumbnail) setThumbnail();
            } else {
                resp.json().then((data) => {
                    throw new Error(data.message);
                });
            }
        }).catch((error) => {
            console.error(error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
            setIsUploading("");
        });
    }, [ product_id, isLoading, setThumbnail, get_user_jwt]);
    useEffect(()=>{
        if (!uploaderRef.current) return;

        uploaderRef.current.addEventListener("dragover", (e)=>{
            (e.target as HTMLElement).style.opacity = "0.75 !important";
            (e.target as HTMLElement).style.backgroundColor = "red !important";
        });

    }, [uploaderRef]);

    const onDragFile = useCallback((e: any)=>{
        if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")){
            if (!dropFileRef.current) return;
            dropFileRef.current.style.display = "flex";
        }
    }, [dropFileRef]);

    const onDragFileLeave = useCallback((e: any)=>{
        // only consider the document
        if (!dropFileRef.current) return;
        dropFileRef.current.style.display = "none";
    }, [dropFileRef]);

    const onDropFile = useCallback((e: any)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer || !e.dataTransfer.files) return;
        if (!uploaderRef.current) return;
        uploaderRef.current.files = e.dataTransfer.files;
        onDragFileLeave(e);
        OnChangeImage();
    }, [uploaderRef, onDragFileLeave, OnChangeImage]);


    useEffect(()=>{
        const c = uploaderRef.current;
        if (!c) return;
        c.addEventListener("dragover", onDragFile);
        c.addEventListener("dragleave", onDragFileLeave);
        c.addEventListener("drop", onDropFile);
        
        return ()=>{
            c.removeEventListener("dragover", onDragFile);
            c.removeEventListener("dragleave", onDragFileLeave);
            c.removeEventListener("drop", onDropFile);
        }
    }, [onDragFile, onDragFileLeave]);
    
    const styles_for_file_drop = {
        display: (thumbnail ? "none" : "flex")
    }

    const image_styles = {
        opacity: (thumbnail ? "1" : "0")
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-end gap-4">
                <div className="relative rounded-md overflow-hidden border">
                    <img src={img_src} style={image_styles} ref={imageRef} className="max-w-[250px] aspect-square object-cover" alt="product thumbnail" />
                    {is_uploading && <div className="absolute inset-0 bg-green-300 bg-opacity-50 flex items-center justify-center flex-col gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
                        <div className="text-green-800">{is_uploading}</div>
                    </div>}
                    <div ref={dropFileRef} style={styles_for_file_drop} className="absolute inset-4 bg-green-100 bg-opacity-80 flex items-center justify-center flex-col gap-3 border-dashed border-2 border-green-500 rounded-md">
                        <img src="/assets/images/upload-image.webp" alt="" className="w-9 h-9 object-cover" />
                        <div className="text-md font-semibold text-center max-w-[80%] text-green-800">Drop you file or Click here to upload.</div>
                    </div>
                    <input type="file" ref={uploaderRef} className="absolute inset-0 opacity-0" onChange={OnChangeImage} />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        {is_waiting_for_upload && <Button variant={"default"} onClick={upload_image}>Upload</Button> }
                        {thumbnail && <Button variant={"link"} className="text-red-500 p-0" onClick={remove_thumbnail}>Remove</Button>}
                    </div> 
                    
                </div>
            </div>
            
            <div className=" text-gray-500 text-sm">Click the image to upload a new image for the thumbnail.</div>
            <div className=" text-gray-500 text-sm">The thumbnail will be shown in your POS application. use 250*250 image less than 512KB.</div>
        </div>
    );
}