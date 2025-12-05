import { IAllowance } from "./allowance";
import { IDeduction } from "./deduction";

export interface ISocialLink {
  id: number;
  faceBook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface IBankDetail {
  id: number;
  bankId: number;
  bankName: string;
  ifsc: string;
  accountNo: string;
  accountName: string;
  accountType: string;
  branchName: string;
  empId: number;
}

export interface IEmployeeDoc {
  id: number;
  documentId: number;
  documentName: string;
  empId: number;
  filePath: string;
}

export interface IEmployee {
  id: number
  empCode: string
  empName: string
  locationFetching: boolean
  companyId: number
  companyName: string
  // categoryId: number
  // categoryName: string
  staffShiftMasterId: number
  shiftMasterNames: string
  departmentId: number
  departmentName: string
  designationId: number
  designationName: string
  machineID: number
  leaveId: number
  leaveName: string
  phoneNumber: string
  email: string
  address: string
  countryId: string
  stateId: string
  cityId: string
  dateOfJoining: string
  fatherName: string
  motherName: string
  genderId: number
  genderName: string
  postId: number
  staffPostName: string
  dob: string
  // weekOffId: number
  // weekOffName: string
  imgPath: string
  basicSalary: number

  staffDocuments: IStaffDocumentDto[]
  staffAllowances: IAddstaffallowance[]
  staffDeductions: IAddstaffdeduction[]
  staffLeaveAssignment: IStaffLeaveAssignment[]
}



///// StaffLeaveAssignment ////
export interface IStaffLeaveAssignment {
  id: number
  staffId: number
  staffName: string
  leaveId: number
  leaveName: string
  leaveDays: number
}
///////////////////////
// Leave Master NOt Staff Leave ////
export interface ILeaveMaster {
  id: number
  leaveId: number
  leave: string
  leaveDays: number
}
/////// End Leave master //////

export interface IStaffDocumentDto {
  id: number
  documentId: number
  documentName: string
  staffId: number
  staffName: string
  filePath: string
}
export interface IAddstaffallowance {
  id: number
  staffId: number
  staffName: string
  miscAllowanceId: number
  miscAllowanceName: string
  postId: number
  staffPostName: string
  inPercent: number
  approximateAmount: number
  type: string

}

export interface IAddstaffdeduction {
  id: number
  staffId: number
  staffName: string
  miscDeductionId: number
  miscDeductionName: string
  postId: number
  staffPostName: string
  inPercent: number
  approximateAmount: number
  type: string
}



