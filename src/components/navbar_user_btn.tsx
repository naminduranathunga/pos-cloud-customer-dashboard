import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";
import usre_default_avatar from "@/assets/user_default_avatar.png";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { FullUser } from "@/interfaces/company_users";

export default function NavbarUserBtn() {
    const { logout, user } = useFlexaroUser();

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    }
    const user_data = user?.data as FullUser;
    console.log(user);
    return (
        
        <DropdownMenu>
            <DropdownMenuTrigger className="flex border-0 items-center gap-1">
                <div className="font-medium text-sm">{user_data?.first_name + " " + user_data?.last_name }</div>
                <div className="border rounded-full overflow-hidden">
                    <img src={usre_default_avatar} alt="user avatar" className="h-8 w-8" />
                </div>
                <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}