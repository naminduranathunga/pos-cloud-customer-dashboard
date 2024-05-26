import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FullUserRole, UserRolePermission } from "@/interfaces/company_users";


export default function UserRoleEditor({userRole, setUserRole, permissions}: {userRole: FullUserRole, setUserRole: Function
    , permissions: UserRolePermission[]}){
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 w-full md:w-[50%]">
                <div className="flex flex-col gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={userRole.name} onChange={(e)=>{setUserRole({...userRole, name:e.target.value})}} />
                </div>
                
                <div className="flex flex-col gap-3">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={userRole.slug} disabled/>
                </div>
                
                <div className="flex flex-col gap-3">
                    <Label htmlFor="description">Description</Label>
                    <textarea id="description" value={userRole.description} className="w-full text-sm border rounded-sm p-3" rows={4} onChange={
                        (e)=>{setUserRole({...userRole, description:e.target.value})} }></textarea>
                </div>
            </div>
                
            
            <div className="flex flex-col gap-3">
                <hr/>
                <h5 className="text-lg font-semibold mb-8">Permissions:</h5>
                <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" id="check_all" checked={userRole.permissions.length === permissions.length} onChange={(e)=>{
                        if (e.target.checked){ 
                            setUserRole({...userRole, permissions: permissions.map((p) => p.name)});
                        } else {
                            setUserRole({...userRole, permissions: []});
                        }
                    }} />
                    <Label htmlFor="check_all">{ (userRole.permissions.length === permissions.length) ? "Remove All" : "Add all permissions"}</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    
                {
                    permissions.map((permission) => {
                        return (
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id={permission.name} checked={userRole.permissions.includes(permission.name)}
                                    onChange={(e)=>{
                                        if (e.target.checked){
                                            setUserRole({...userRole, permissions: [...userRole.permissions, permission.name]});
                                        } else {
                                            setUserRole({...userRole, permissions: userRole.permissions.filter((p) => p !== permission.name)});
                                        }
                                    }}
                                 />
                                <Label htmlFor={permission.name}>{permission.label}</Label>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            
        </div>
    )
}