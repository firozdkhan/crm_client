export interface FeesDetailDto {
  id: number;
  feesmasterId: number;
  feeType: string;
  feesId: number;
  feeNameType: string;
  amount: number;
  discount: number;
}

export interface IFeesDeposit {
  id: number;
  sId: number;
  studentName: string;
  receiptNo: number;
  payMode: string;
  totalAmount: number;
  depositDate: Date;
  remark: string;
  userId: number;
  userName: string;
  orderId: string;
  transactionId: string;
  chequeNo: string;
  active: boolean;
  sessionId: number;
  bankId: number;
  bankName: string;
  sessionName: string;
  feesDetailDto: FeesDetailDto[];
}