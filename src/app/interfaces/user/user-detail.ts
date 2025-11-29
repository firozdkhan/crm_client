export interface IUserDetail {
  userId: number
  name: string
  mobileNo: any
  photoUrl: string
  token: string,
  userTypeId: number;

  srNo: string;

  userType: string;
  fatherName: string;



  active: boolean;
  sessionId: number;
  sessionName: string;
  twoFactorEnabled: boolean;
  isPasswordChanged: boolean;


  //added on 27-04
  isActive: boolean;
}