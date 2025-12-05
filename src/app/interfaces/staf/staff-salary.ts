export interface Root {
  id: number
  staffId: number
  staff: string
  basic: number
  gross: number
  net: number
  timeperiod: string
  staffAllowances: StaffAllowance[]
  staffDeductions: StaffDeduction[]
  totalAllowance: number
  totaldeduction: number
}

export interface StaffAllowance {
  id: number
  staffId: number
  staff: string
  allowanceId: number
  allowance: string
  percentage: number
  lumSum: number
}

export interface StaffDeduction {
  id: number
  staffId: number
  staff: string
  deductionId: number
  deduction: string
  percentage: number
  lumSum: number
  deductionAmount: number
}
