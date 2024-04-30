import NavigationBarComponent from "@/components/navigation_bar";
import SideBar from "@/components/side_bar";
import { Outlet } from "react-router-dom";


export default function PageLayout(){
    return (
        <main className="flex w-full min-h-[100vh] flex-grow bg-green-50">
            <SideBar />
            <div className="w-full">
                <NavigationBarComponent />
                <div className="w-full px-4 pt-4">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}