export interface IPurchaseMaster {
  patchValue(purchase: IPurchaseMaster): unknown;
  id: number;
  invoiceNo: string;
  supplierId: number;
  suppliersName: string;
  bankId: number;
  purchaseDate: Date;
  modifyDate: Date;
  purchaseInvoiceNumber: string;
  totalTaxAmount: number;
  totalProductDiscount: number;
  billDiscount: number;
  shippingAmount: number;
  totalAmount: number;
  netAmount: number;
  payAmount: number;
  balanceDue: number;
  grandtotal: number;
  status: string;
  billDescription: string;
  purchaseDetails: IPurchaseDetail[];
}

export interface IPurchaseDetail {
  id: number;
  purchaseMasterId: number;
  purchaseMasterName: string;
  productId: number;
  productName: string;
  taxNumberId: number;
  taxNumberName: string;
  quantity: number;
  purchasePrice: number;
  productDiscount: number;
  productDiscountAmount: number;
  netAmount: number;
  grossAmount: number;
  taxAmount: number;
  amount: number;
  productDescription: string;
  incTax: boolean;
}
