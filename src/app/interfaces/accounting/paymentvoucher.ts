export interface IPaymentVoucher {
  // patchValue(paymentvoucher: IPaymentVoucher): unknown;
  id: number;
  paymentTypeId: number;
  paymentType: string;
  paymentInvoiceNo: string;
  purchaseInvoiceNo: string;
  supplierId: number;
  supplierName: string;
  paymentDate: string;
  debit: number;
  credit: number;
  transactionNumber: string;
  chequeNo: string;
  chequeDate: string;
  refreanceNumber: string;
  longRefreance: string;
}
