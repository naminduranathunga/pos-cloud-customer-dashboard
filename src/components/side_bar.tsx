import logo from "@/assets/logo.svg";
import SideBarList from "./sidebar/sidebar_list";

export default function SideBar() {
    return (
        <nav className="bg-green-900 text-white min-w-[250px] max-w-[250px] flex flex-col">
            <div className="bg-green-800 px-4 py-6 ">
                <img className="h-6" src={logo} alt="logo"/>
            </div>

            <SideBarList />
        </nav>
    )
}