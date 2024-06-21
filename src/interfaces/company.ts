

export interface CompanyBranch {
    _id: string;
    name: string;
    address: string;
    phone: string[];
    email: string;
};

export interface CompanyDetails {
    _id: string;
    name: string;
    brn: string;
    address: string;
    phone: string[];
    email: string;
    modules: string[];
    branches?: CompanyBranch[];
};