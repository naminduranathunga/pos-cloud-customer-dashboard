
export interface ProductSimple {
    _id: string;
    name: string;
    price: number;
    sku: string;
    category: string;
    barcodes?: string[];
}


export interface FullProduct {
    _id: string;
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
    _id: string,
    date: string,
    sales_price: number,
    cost_price: number,
    quantity: number,
}