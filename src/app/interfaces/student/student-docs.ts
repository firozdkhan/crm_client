export interface IDocument {
  sId: number;
  documentId: number;
  documentName: string;
  fileUrl: string;
  files: string;
}


export interface IInquiryDocument {
  inquiryId: number;
  documentId: number;
  documentName: string;
  fileUrl: string;
  files: string;
}

export interface IStudentDoc {
  id: number
  sId: number
  studentName: string
  documentId: number
  documentName: string
  fileUrl: string
}