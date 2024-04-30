import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown, User2 } from "lucide-react";
import usre_default_avatar from "@/assets/user_default_avatar.png";

export default function NavbarUserBtn() {
    return (
        
        <DropdownMenu>
            <DropdownMenuTrigger className="flex border-0 items-center gap-1">
                <div className="font-medium text-sm">User Name</div>
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
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}