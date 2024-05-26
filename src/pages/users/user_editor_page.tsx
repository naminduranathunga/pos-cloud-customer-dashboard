import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/custom/confirm";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import UserAccountEditor from "@/components/users/editor/UserEditor";
import { FullUser, SumpleUserRole } from "@/interfaces/company_users";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const new_user: FullUser = {
    _id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: {
        _id: "",
        name: "",
        is_public: false,
        permissions: [],
        slug: "",
        description: ""
    },
    password: ""
}

export default function EditUserPage(){
    const [user, setUser] = useState<FullUser | null>(null); 
    const [isSavingUser, setIsSavingUser] = useState<boolean>(false); 
    const [user_roles, setUserRoles] = useState<SumpleUserRole[] | null>(null); // [1
    const [isDeletingRole, setIsDeletingRole] = useState<boolean>(false);

    const {
        isLoading,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();

    // get user data
    useEffect(()=>{
        if (isLoading) return;
        if (user !== null) return;
        const user_id = new URLSearchParams(window.location.search).get("_id");
        if (user_id === null){
            setUser(new_user);
            return;
        }
        const jwt = get_user_jwt();

        fetch(`${config.apiURL}/user-manager/users/get?_id=${user_id}`, {
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
            if (users.length > 0){
                setUser(users[0]);
            } else {
                
            }
        }).catch((err)=>{
            console.error(err);
            toast({title: "Error", description: "Failed to load user", variant: "destructive"});
        });

    }, [isLoading, get_user_jwt, toast, user]);

    // get user roles list
    useEffect(() => {
        if (isLoading) return;
        if (user_roles !== null) return;
        const jwt = get_user_jwt();

        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/get`, {
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
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((roles)=>{
            setUserRoles(roles);
        }).catch((err)=>{
            setUserRoles([]);
            console.error(err);
            toast({title: "Error", description: "Failed to load user roles", variant: "destructive"});
        });
    }, [isLoading, get_user_jwt, toast, user_roles]);


    const onClickSave = useCallback(()=>{
        if (isSavingUser) return;
        if (isLoading) return;
        setIsSavingUser(true);

        const jwt = get_user_jwt();
        let user_for_save:any = {...user};
        user_for_save.role_id = user?.role._id;

        fetch(`${config.apiURL}/user-manager/users/${(user?._id?"update":"create")}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user_for_save)
        }).then((response)=>{
            if (!response.ok){
                if (response.status === 401){
                    toast({title: "Unauthorized", description: "You are not authorized to view this page"});
                    setTimeout(()=>{window.location.href = "/login"}, 500);
                }
                response.json().then((data)=>{
                    if (data.message){
                        toast({title: "Error", description: data.message, variant: "destructive"});
                    }else{
                        throw new Error("Failed to save user");
                    }
                }).catch((err)=>{
                    toast({title: "Error", description: "Failed to save user", variant: "destructive"});
                });
            }
            return response.json();
        }).then((data)=>{
            if (!user?._id){
                window.location.href = `/users/edit?_id=${data._id}`;
            }
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }).finally(()=>{
            setIsSavingUser(false);
        });
    }, [user, isSavingUser, isLoading, get_user_jwt]);

    const DeleteConfirmResponse = useCallback((confirmed:boolean)=>{
        if (!confirmed) return;

        if (isDeletingRole) return;
        if (isLoading) return;
        setIsDeletingRole(true);
        const jwt = get_user_jwt();
        const user_to_delete = {
            _id: user?._id,
        }

        fetch(`${config.apiURL}/user-manager/users/remove`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(user_to_delete)
        }).then((response)=>{
            if (!response.ok){
                if (response.status === 401){
                    toast({title: "Unauthorized", description: "You are not authorized to view this page"});
                    setTimeout(()=>{window.location.href = "/login"}, 500);
                    return;
                }
                response.json().then((data)=>{
                    if (data.message){
                        toast({title: "Error", description: data.message, variant: "destructive"});
                    }else{
                        throw new Error("Failed to delete user");
                    }
                }).catch((err)=>{
                    toast({title: "Error", description: "Failed to delete user", variant: "destructive"});
                });
                return;
            }
            window.location.href = "/users";
        }).catch((err)=>{
            console.error(err);
            toast({title: "Error", description: "Failed to delete user", variant: "destructive"});
        }).finally(()=>{
            setIsDeletingRole(false);
        });

    }, [get_user_jwt, toast, user, isDeletingRole, isLoading]);
    const { Confirm } = useConfirm();
    const OnClickDelete = useCallback(()=>{
        Confirm("Delete User Role", "Are you sure you want to delete this user account?", "destructive", DeleteConfirmResponse);
    }, [DeleteConfirmResponse]);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
            <h1 className="font-semibold text-lg md:text-2xl">Edit User</h1>

            <Link to={`/users/edit`} className="flex items-center gap-2 ms-auto">
                <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New User</Button>
            </Link>

            { (user && user._id)  && 
            <Button className="flex items-center gap-2" variant={"destructive"} onClick={OnClickDelete} > 
                <Trash2 size={"1em"} /> Delete  {isDeletingRole && <Loader2 size={"1em"} className="animate-spin" />}
            </Button>}
            
            <Button className="flex items-center gap-2" title="Ctrl + S" onClick={onClickSave} > <Save size={"1em"} /> Save  {isSavingUser && <Loader2 size={"1em"} className="animate-spin" />}</Button>

            </header>


            <div className="grid grid-cols-1 gap-6">
                {user && user_roles && <UserAccountEditor user={user}   setUser={setUser} user_roles={user_roles} />}
            </div>

        </div>
    )
}