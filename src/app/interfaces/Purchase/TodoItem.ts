// models/todo-item.model.ts
export interface ITodoItem {
  id: number;
  productId: number;
  productName: string;
  qty: number;
  unitName: string;
  purchaseRate: number;
  discountAmount: number;
  taxName: string;
  taxAmount: number;
  totalAmount: number;
}
