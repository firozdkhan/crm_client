export interface IAllowance {
  allowanceName: string
  allowanceAmount: number
  percent: number
  staffSalarysDetailId: number
  staffSalarysDetailDeduct: string
}

export interface IDeduction {
  deductionName: string
  deductionAmount: number
  percent: number
  staffSalarysDetailId: number
  staffSalarysDetailAllow: string
}

export interface ISalary {
  id: number;
  staffId: number;
  staffName: string;
  post: string;
  departmentName: string;
  designationName: string;
  shift: string;
  fatherName: string;
  basicSalary: number;
  proratedBasicSalary: number;
  updateAllowances: IAllowance[];
  updateDeductions: IDeduction[];
  accountNo: string;
  bankName: string;
  branchName: string;
  totalAttendance: number;
  totalWorkingDays: number;
  absentDays: number;
  salaryMonth: string;
  issueDate: string;
  paymentMode: string;
  netSalary: number;
  companyName: string;
  advance: number;
  remaning: number;
  absentAmount: number
}
