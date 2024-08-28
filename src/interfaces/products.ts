
export interface ProductSimple {
    id: string;
    name: string;
    price: number;
    sku: string;
    category: string;
    barcodes?: string[];
    thumbnail?: string;
    min_price?: number;
    max_price?: number;
}


export interface FullProduct {
    id: string;
    name: string;
    sku: string;
    inventory_type: string;
    category: string;
    is_active: boolean;
    thumbnail: string;
    prices: number[];
    barcodes: string[];
    weight: number;
    size: string;
}


export interface ProductInventory {
    id?: number,
    product_id: string,
    branch_id: string,
    sales_price: number,
    cost_price: number,
    quantity: number,
}