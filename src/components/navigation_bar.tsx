import { Link } from "react-router-dom";
import NavbarUserBtn from "./navbar_user_btn";
import { HelpCircle } from "lucide-react";


export default function NavigationBarComponent(){
    return (
        <nav className="flex justify-end items-center gap-5 bg-white py-3.5 px-12">
            <Link to="https://docs.flexaro.net" target="_blank"
                className="text-gray-800 hover:text-green-800 transition"
                title="Documentation"> <HelpCircle size={"1.25rem"} /> </Link>
            <NavbarUserBtn />
        </nav>
    )
}