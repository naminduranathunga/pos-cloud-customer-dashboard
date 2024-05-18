import NavigationBarComponent from "@/components/navigation_bar";
import SideBar from "@/components/side_bar";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmDialogProvider } from "@/components/ui/custom/confirm";


export default function PageLayout(){
    const {user, isLoading} = useFlexaroUser();

    if (!isLoading && !user){
        window.location.href = "/login";
        return (<></>);
    }

    return (
        <main className="flex w-full min-h-[100vh] flex-grow bg-green-50">
            {isLoading ? 
            <>Loading...</> 
            :
            <>
                <SideBar />
                <ConfirmDialogProvider>
                <div className="w-full">
                    <NavigationBarComponent />
                    <div className="w-full px-4 pt-4">
                        <Outlet />
                    </div>
                </div>
                </ConfirmDialogProvider>
            </>}
            <Toaster />
        </main>
    );
}