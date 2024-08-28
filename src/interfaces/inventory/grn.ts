export interface GRNProduct {
    id?: number;
    grn_id?: number;
    product: {
        id: string;
        name: string;
    };
    cost_price: number;
    sales_price: number;
    sale_price?: number;
    quantity: number;
}

export interface Vendor {
    id: number;
    name?: string;
    address?: string;
    contact?: string;
    email?: string;
    notes?: string;
}

export interface GRNAttachment{
    id: number;
    file: string;
    name: string;
}

export interface GRNSingle {
    id?: number;
    grn_number: string;
    vendor: Vendor|null;
    date: string;
    invoice_no?: string;
    status: "draft" | "completed" | "cancelled";
    products: GRNProduct[];
    attachments?: string[] | GRNAttachment[] | null;
    branch?: string;
    invoice_value?: number;
    total: number;
    adjusted_total?: number;
    notes?: string;
    user?: string;
}