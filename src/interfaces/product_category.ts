

export default interface ProductCategory {
    id: string;
    name: string;
    parent: ProductCategory | null;
}