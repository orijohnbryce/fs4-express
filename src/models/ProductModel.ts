export default class ProductModel {
    id?: number;
    sku: string;
    name: string;
    isActive: boolean;
    price: number;
    stock: number;
    description?: string;
    

    constructor(
        id: number | undefined,
        sku: string,
        name: string,
        isActive: boolean,
        price: number,
        stock: number,
        description?: string
    ){
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.isActive = isActive;
        this.price = price;
        this.stock = stock;
        this.description = description
    }
}

// const p = new ProductModel(12, "sdfsdf", "banana", true, 300, 3, "this is descriptoin" )
