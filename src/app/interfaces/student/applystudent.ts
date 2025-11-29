import { IInquiryDocument, IStudentDoc } from "./student-docs"



export interface IApplystudent {
  id: number
  formNumber: string
  srNumber: string
  enrollmentNumber: string
  admissionDate: string
  studentName: string
  fatherName: string
  motherName: string
  dob: string
  gender: string
  studentTypeId: number
  studentTypeName: string
  mobileNumber: string
  uniqueId: string
  categoryTypeId: number
  categoryTypeName: string
  address: string
  previousInstitute: string
  classId: number
  className: string
  sectionId: number
  sectionName: string
  countryId: number
  countryName: string
  optionalSubjectOne: string
  optionalSubjectTwo: string
  optionalSubjectThree: string
  imgPath: string
  active: boolean
  email: string
  sessionId: number
  inquiryId: number
  studentDocDtos: IStudentDoc[];
  selectedRow: boolean;
}