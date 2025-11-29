export interface IReceiptVoucher {
  id: number;
  receiptInvoiceNo: string;
  saleInvoiceNo: string;
  paymentTypeId: number;
  paymentTypeName: string;
  customerId: number;
  customerName: string;
  receiptDate: string;
  debit: number;
  credit: number;
  transactionNumber: string;
  chequeNo: string;
  chequeDate: string;
  refreanceNumber: string;
  longRefreance: string;
}
