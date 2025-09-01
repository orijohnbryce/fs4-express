export default class ProductModel {
    id?: number;
    sku: string;
    name: string;
    description?: string;
    price: number;
    isActive: boolean;
    stock: number;
  
    constructor(
      id: number | undefined,
      sku: string,
      name: string,
      price: number,
      stock: number,
      description?: string,
      isActive: boolean = true
    ) {
      this.id = id;
      this.sku = sku;
      this.name = name;
      this.price = price;
      this.stock = stock;
      this.description = description;
      this.isActive = isActive;
    }
  }