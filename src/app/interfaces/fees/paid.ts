
export interface IPaidFeesDetail {
  id: number;
  name: string;
  feeMasterId: number;
  feeType: string;
  feesId: number;
  amount: number;
  discount: number;
  fine: number;
}

export interface IPaidFees {
  receiptNo: number;
  studentName: string;
  payMode: string;
  totalAmount: number;
  depositDate: Date;
  remark: string;
  userName: string;
  orderId: string;
  transactionId: string;
  sessionName: string;
  totalBalance: number;
  feesDetail: IPaidFeesDetail[];
}
