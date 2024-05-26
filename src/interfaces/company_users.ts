

export interface SimpleUser{
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
}


export interface SumpleUserRole {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    is_public: boolean;
}


export interface FullUserRole {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    is_public: boolean;
    permissions: string[];
}

export interface UserRolePermission {
    name: string;
    label: string;
    module: string;
};

export interface FullUser{
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: FullUserRole|SumpleUserRole;
    password?: string;
}