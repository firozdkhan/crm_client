export interface IExpensesReport {
  id: number;
  invoiceNo: string;
  expenseDate: string;
  bankId: number;
  userId:number;
  bankName: string;
  description: string;
  totalAmount: number;
  expensesReportDetails: ExpensesReportDetail[];
}

export interface ExpensesReportDetail {
  id: number;
  expensesId: number;
  expensesReport: string;
  expensesTypeId: number;
  expensesTypeName: string;
  expenseAmount: number;
  expensesDescription: string;
}
