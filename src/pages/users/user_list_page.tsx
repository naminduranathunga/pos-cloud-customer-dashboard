import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import UserListTable from "@/components/users/UserTable";
import { SimpleUser } from "@/interfaces/company_users";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, FileDown, FileUp, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserListPage(){
    const [search_term, setSearchTerm] = useState<string>("");
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [users, setUsers] = useState<SimpleUser[]|null>(null);
    const {
        isLoading,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();

    const tottleSearchFn = useCallback(() => {
        if (toggleSearch) {
            setSearchTerm("");
        }
        setToggleSearch(!toggleSearch);

    }, [toggleSearch]);

    useEffect(()=>{
        if (isLoading) return;
        if (users !== null) return;
        const jwt = get_user_jwt();

        fetch(`${config.apiURL}/user-manager/users/get`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        }).then((response)=>{
            if (!response.ok){
                if (response.status === 401){
                    toast({title: "Unauthorized", description: "You are not authorized to view this page"});
                    setTimeout(()=>{window.location.href = "/login"}, 500);
                    return;
                }
                throw new Error("Failed to fetch users");
            }
            return response.json();
        }).then((users)=>{
            setUsers(users);
        }).catch((err)=>{
            setUsers([]);
            console.error(err);
            toast({title: "Error", description: "Failed to load users", variant: "destructive"});
        });

    }, [isLoading, get_user_jwt, toast, users]);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">Users</h1>

            <Link to={`/users/edit`} className="flex items-center gap-2 ms-auto">
                <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New User</Button>
            </Link>
            <Input placeholder="Search category" value={search_term} onChange={(e) => setSearchTerm(e.target.value)} className={"max-w-[300px] " + (toggleSearch ? "block" : "hidden")} />
            <Button className="flex items-center gap-2 hover:bg-green-900 hover:text-white transition" 
                variant={"secondary"} 
                onClick={tottleSearchFn}
                title="Search category"> <Search size={"1em"} /></Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"secondary"} className="hover:bg-green-900 hover:text-white transition"> <EllipsisVertical /> </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><FileUp size={"1em"} className="me-2" /> Import</DropdownMenuItem>
                    <DropdownMenuItem><FileDown size={"1em"} className="me-2" /> Export</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </header>


            <div className="grid grid-cols-1 gap-6">
                <UserListTable search_term={search_term} userList={users} />
            </div>

        </div>
    )
}