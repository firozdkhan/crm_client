export interface ITimeAttedanace {
  id: number;
  staffId: number;
  empName: string;
  empCode: string;
  attendanceStatus: string;
  departmentId: number;
  departmentName: string;
  designationId: number;
  designationName: string;
  date: string;
  inTime: string;
  outTime: string;
  inTimeString: string;
  outTimeString: string;
  workingHours: string;
  shiftMasterId: number;
  shiftName: string;
}
