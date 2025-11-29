export interface IDashboard {
  employeePresent: IEmployeePresent[]
  studentPresents: IStudentPresent[]
  fees: IFee[]
  students: IStudent[]
  categories: ICategory[]
  finance: IFinance[]
  birthdayIds: IBirthdayStudent[]
  leaveManagements: IDashboardLeave[]
}

export interface IEmployeePresent {
  total: number
  present: number
  absent: number
}

export interface IStudentPresent {
  absents: number
  presents: number
  className: string
  classId: number
}

export interface IFee {
  labels: string
  feesData: number

}

export interface ICategory {
  labels: string
  categoryData: number,
  total: number,
  per: number,

}

export interface IStudent {
  promotions: any[]
  sessionId: string
  healthRecords: any
  photoUrl: string
  fatherImageUrl: string
  motherImageUrl: string
  guardianImageUrl: string
  id: number
  // previousHistory: import("e:/AzharNew/Azhar/AngularLive/taleem/school/client/src/app/student/interfaces/student-interface").IPreviousHistory[]
  // studentDocs: import("e:/AzharNew/Azhar/AngularLive/taleem/school/client/src/app/student/interfaces/student-interface").IDocument[]
  // studentFees: import("e:/AzharNew/Azhar/AngularLive/taleem/school/client/src/app/student/interfaces/student-interface").IStudentFee[]
  // studentSubjects: import("e:/AzharNew/Azhar/AngularLive/taleem/school/client/src/app/student/interfaces/student-interface").ISubject[]
  siblingDetails: any
  totalStudent: number
  newStudent: number
  className: string
  classId: number
}

export interface IFinance {
  amount: number
  months: string
  ttype: string
}

export interface IBirthdayStudent {
  id: number
  srNumber: string
  className: string
  section: string
  name: string
  mobileNo: string
  photoUrl: string
}

export interface IDashboardLeave {
  leaveTypeId: number
  id: number
  empId: number
  status: any
  leaveType: string
  dates: string
  reason: string
  isApproved: string
  employeeName: string
  applyDate: string
  approveDate?: string
  fromDate: string
  toDate: string
  session: string
  sessionId: number
  employeeImage: string
}