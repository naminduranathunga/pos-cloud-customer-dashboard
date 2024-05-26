import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/custom/confirm";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import UserRoleEditor from "@/components/users/roles/editor/UserRoleEditor";
import { FullUserRole, UserRolePermission } from "@/interfaces/company_users";
import config from "@/lib/config";
import useFlexaroUser from "@/lib/hooks/flexaro_user";
import { Loader2, Plus, Save, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const empty_user_role: FullUserRole = {
    _id: "",
    name: "",
    slug: "",
    is_public: false,
    permissions: []
}

export default function EditUserRolePage(){
    const [userRole, setUserRole] = useState<FullUserRole | null>(null);
    const [permission_list, setPermissionList] = useState<UserRolePermission[] | null>(null);
    const [isSavingUser, setIsSavingUser] = useState<boolean>(false);
    const [isDeletingRole, setIsDeletingRole] = useState<boolean>(false);

    const {
        isLoading,
        get_user_jwt,
    } = useFlexaroUser();
    const {toast} = useToast();


    // get user role data
    useEffect(() => {
        if (isLoading) return;
        if (userRole !== null) return;

        // get url params
        const urlParams = new URLSearchParams(window.location.search);
        const role_id = urlParams.get("_id");
        if (role_id === null){
            setUserRole(empty_user_role);
            return;
        }

        const jwt = get_user_jwt();

        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/get?with_permissions=true&_id=${role_id}`, {
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
            if (roles.length > 0){
                setUserRole(roles[0]);
            } else {
                throw new Error("No roles found");
            }
        }).catch((err)=>{
            setUserRole(empty_user_role);
            console.error(err);
            toast({title: "Error", description: "Failed to load user roles", variant: "destructive"});
        });
    }, [isLoading, get_user_jwt, toast, userRole]);

    useEffect(() => {
        if (isLoading) return;
        if (permission_list !== null) return;

        const jwt = get_user_jwt();

        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/get_permissions`, {
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
        }).then((permissions)=>{
            setPermissionList(permissions);
            console.log(permissions);
        }).catch((err)=>{
            setPermissionList([]);
            console.error(err);
            toast({title: "Error", description: "Failed to load user roles", variant: "destructive"});
        });
    }, [isLoading, get_user_jwt, toast, permission_list]);

    const setUserRoleFn = (role: FullUserRole) => {
        setUserRole(role);
    }

    const onClickSave = useCallback(()=>{
        if (isSavingUser) return;
        if (isLoading) return;
        setIsSavingUser(true);
        const jwt = get_user_jwt();
        console.log(userRole);
        
        const role_to_save = {
            _id: userRole?._id,
            role_name: userRole?.name,
            description: userRole?.description,
            permissions: userRole?.permissions
        }


        // fetch user roles
        fetch(`${config.apiURL}/user-manager/roles/${(userRole?._id)?"update":"create"}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(role_to_save)
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
        }).then((data)=>{
            toast({title: "Success", description: "Role saved successfully"});
            if (!role_to_save._id) {
                window.location.href = `/users/roles/edit?_id=${data._id}`;
            }
        }).catch((err)=>{
            console.error(err);
            toast({title: "Error", description: "Failed to save role", variant: "destructive"});
        }).finally(()=>{
            setIsSavingUser(false);
        });

    }, [userRole, get_user_jwt, toast, setIsSavingUser]);

    const DeleteConfirmResponse = useCallback((confirmed:boolean)=>{
        if (!confirmed) return;

        if (isDeletingRole) return;
        if (isLoading) return;
        setIsDeletingRole(true);
        const jwt = get_user_jwt();
        const role_to_delete = {
            _id: userRole?._id,
        }

        fetch(`${config.apiURL}/user-manager/roles/remove`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(role_to_delete)
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
                        throw new Error("Failed to delete role");
                    }
                }).catch((err)=>{
                    toast({title: "Error", description: "Failed to delete role", variant: "destructive"});
                });
                return;
            }
            window.location.href = "/users/roles";
        }).catch((err)=>{
            console.error(err);
            toast({title: "Error", description: "Failed to delete role", variant: "destructive"});
        }).finally(()=>{
            setIsDeletingRole(false);
        });
    }, [get_user_jwt, toast, userRole, isDeletingRole]);

    const { Confirm } = useConfirm();
    const OnClickDelete = useCallback(()=>{
        Confirm("Delete User Role", "Are you sure you want to delete this role?", "destructive", DeleteConfirmResponse);
    }, [DeleteConfirmResponse]);
    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-10">
            <header className="mb-6 flex items-center border-b border-gray-300 py-4 gap-4">
                <h1 className="font-semibold text-lg md:text-2xl">User Roles</h1>

                <Link to={`/users/roles/edit`} reloadDocument className="flex items-center gap-2 ms-auto">
                    <Button className="flex items-center gap-2 ms-auto" > <Plus size={"1em"} /> New Role</Button>
                </Link>
                { (userRole && userRole._id)  && 
                <Button className="flex items-center gap-2" variant={"destructive"} onClick={OnClickDelete} > 
                    <Trash2 size={"1em"} /> Delete  {isDeletingRole && <Loader2 size={"1em"} className="animate-spin" />}
                </Button>}

                <Button className="flex items-center gap-2" title="Ctrl + S" onClick={onClickSave} > <Save size={"1em"} /> Save  {isSavingUser && <Loader2 size={"1em"} className="animate-spin" />}</Button>
            </header>


            <div className="grid grid-cols-1 gap-6">
                {
                (userRole && permission_list) ? <UserRoleEditor userRole={userRole} permissions={permission_list} setUserRole={setUserRoleFn} />
                    : <div>Loading...</div>
                }
            </div>

        </div>
    )
}