export interface IFeesCollection {
  id: number;
  sId: number;
  srNo: string;
  name: string;
  fatherName: string;
  className: string;
  receiptNo: number;
  payMode: string;
  totalAmount: number;
  depositDate: Date;
  remark: string;
  sessionId: number;
  collectBy: string;
}