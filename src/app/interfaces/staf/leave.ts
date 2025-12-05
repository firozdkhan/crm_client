
// export interface ILeaveApply {
//   leaveTypeId: number
//   id: number
//   name: string
//   empId: string
//   status: string
//   leaveTypeName: string
//   dates: string
//   reason: string
//   isApproved: string
//   employeeName: string
//   applyDate: Date
//   approveDate: Date
//   fromDate: string
//   toDate: string
//   sessionName: string
//   sessionId: number
// }

export interface ILeaveApply {
  id: number
  leaveId: number
  leave: string
  staffId: number
  staff: string
  dates: string
  applyDate: string
  approveDate: string
  fromDate: string
  toDate: string
  reason: string
  isApproved: string
}
