export interface IFeeDetail {
  name: string;
  feeType: string;
  feesId: number;
  amount: number;
  deposit: number;
  discount: number;
  dueDate: Date;
  balance: number;
  lateFeePerDay: number;
  lateFeesAmt: number;
  lateFeesDeposit: number;
  lateFeesBalance: number;
  toBeDeposit: number;
  toBeLateFees: number;
  toBeDiscount: number;
}

export interface IStudentFees {
  payMode: string;
  totalAmount: number;
  depositDate: Date;
  remark: string;
  orderId: string;
  transactionId: string;
  totalBalance: number;
  totalPaid: number;
  feeDetail: IFeeDetail[];
}