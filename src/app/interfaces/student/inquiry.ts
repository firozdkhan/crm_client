import { IDocument, IInquiryDocument } from "./student-docs"

export interface IInquiry {
  id: number
  studentName: string
  fatherName: string
  classId: number
  className: string
  email: string
  mobileNumber: string
  phoneNumber: string
  address: string
  detials: string
  date: string
  dob: string
  active: boolean
  isConfirm: boolean
  studentDoc: IInquiryDocument[]
}
