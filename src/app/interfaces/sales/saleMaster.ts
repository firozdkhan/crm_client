export interface ISaleMaster {
  id: number;
  invoiceNo: string;
  customerId: number;
  customerName: string;
  bankId: number;
  bankName: string;
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
  salesById:number;
  salesBy:string;
    
  userId:number;
  status: string;
  sgst: string;
  cgst: string;
  igst: string;
  customerGst: string;
  billDescription: string;
  saleDetails: ISalesDetail[];
}

export interface ISalesDetail {
  id: number;
  saleMasterId: number;
  saleMasterName: string;
  productId: number;
  productName: string;
  taxNumberId: number;
  taxNumber: string;
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
