export default class OrderItemModel {
  id?: number;
  orderId: number;
  productId: number;
  qty: number;
  unitPrice: number;
  discount: number;

  constructor(
    id: number | undefined,
    orderId: number,
    productId: number,
    qty: number,
    unitPrice: number,
    discount: number = 0
  ) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.qty = qty;
    this.unitPrice = unitPrice;
    this.discount = discount;
  }
}