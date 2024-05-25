

export interface SimpleUser{
    _id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: {
        _id: number;
        name: string;
    };
}


export interface SumpleUserRole {
    _id: number;
    name: string;
    slug: string;
    description?: string;
    is_public: boolean;
}


export interface FullUserRole {
    _id: number;
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
    _id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: FullUserRole;
    permissions: string[];
}