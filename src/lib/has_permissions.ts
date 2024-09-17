
const CompanyAdminPermission = "company-admin";  // default permission for company admin


export default function has_user_permissions(user:any, permissions:string[]|string, operator:string="or"):boolean {
    if (!user) return false;
    const role_permissions = user.data?.role_info?.permissions;
    if (!Array.isArray(role_permissions)) return false;
    if (role_permissions.length === 0) return false;
    if (!Array.isArray(permissions)) permissions = [permissions];

    // check if user is company admin
    if (role_permissions.includes(CompanyAdminPermission)) return true;
    

    if (operator === "or"){
        for (let i = 0; i < permissions.length; i++) {
            if (role_permissions.includes(permissions[i])) return true;
        }
        return false;
    } else if (operator === "and"){
        for (let i = 0; i < permissions.length; i++) {
            if (!role_permissions.includes(permissions[i])) return false;
        }
        return true;
    } else {
        return false;
    }
}