export interface IStockPosting {
  id: number;
  invoiceDate: Date;
  voucherNo: string;
  invoiceNo: string;
  productId: number;
  productName: string;
  inwardQty: number;
  outwardQty: number;
  rate: number;
  remainingQty: number;
  addedDate: Date;
}
