export interface IFeesSummery {
  classId: number;
  sectionId: number;
  className: string;
  sectionName: string;
  totalAmount: number;
  totalPaid: number;
  totalDiscount: number;
  dueBalance: number;
}