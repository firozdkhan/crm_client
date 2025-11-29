import { ITcDetails } from "./tcDetails";

export interface ITC {
  tcDate: string
  id: number
  tcNo: number
  causeRemoval: string
  sessionId: number
  sId: number
  status: string
  tcDetail: ITcDetails[]
}

