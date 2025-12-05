export interface IStaffCategory {
  id: number
  categoryId: number
  category: string
  earlyArrivalAllow: string
  onTime: string
  flexibleTime: string
  lateArrivalAllow: string
  halfDay: string
  lunchTimeStart: string
  lunchTimeEnd: string
  absent: string
  earlyDepartureAllow: string
  departureTime: string
  lateDepartureIgnore: string
  overTimeIgnore: string
  overTimeAllow: string
  totalLunchTime: string
  totalWorkingHours: string
}
