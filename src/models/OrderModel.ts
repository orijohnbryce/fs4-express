export default class OrderModel {
  id?: number;
  customerId: number;
  status: 'new' | 'paid' | 'shipped' | 'cancelled' | 'refunded';
  orderDate?: Date;;
  note?: string;

  constructor(
    id: number | undefined,
    customerId: number,
    status: 'new' | 'paid' | 'shipped' | 'cancelled' | 'refunded' = 'new',
    orderDate?: Date,
    note?: string
  ) {
    this.id = id;
    this.customerId = customerId;
    this.status = status;
    this.orderDate = orderDate;
    this.note = note;
  }
}