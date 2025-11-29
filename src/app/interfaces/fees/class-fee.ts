export interface IClassFees {
  id: number;
  classId: number;
  className: string;
  feesId: number;
  feesName: string;
  feesAmount: number;
  dueDate: Date;
  isAnnual: boolean;
  isAnnual2: string;
  lateFees: number;
  sessionId: number;
  discount: number;
  applyFees: number;
  sessionName: string;
  checked?: boolean;
}

export interface IClassFeesData {
  code: number;
  success: boolean;
  message: string;
  data: IClassFees[];
}
