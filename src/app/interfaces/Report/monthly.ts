export interface IMonthaly {
  staffId: number;
  staffName: string;
  shiftName: string;
  totalCompanyWorkingDays: number;
  workingDays: number;
  totalCompanyOpenHours: number;
  totalStaffAttendanceDays: number;
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalLateDays: number;
  totalOTDays: number;
  totalWorkingHours: string;
  totalSundays: number;
  totalOvertimeMinutes: number;
}
