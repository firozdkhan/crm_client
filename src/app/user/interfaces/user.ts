
export interface IUser {
  userTypeId: number;
  userId: number;
  srNo: string;
  name: string;
  userType: string;
  fatherName: string;
  mobileNo: string;
  photoUrl: string;
  token: string;
  active: boolean;
  sessionId: number;
  sessionName: string;
  twoFactorEnabled: boolean;
  isPasswordChanged: boolean;
   

  //added on 27-04
  isActive: boolean;
}

export interface ILogin {
  userId: string;
  password: string;
  rememberMe: boolean;
}

export interface IRoles {
  id: number;
  name: string;
  indexPage: string;
  totalUser: number;
  permissions: number[];
}

export interface IUserProfile {
  id: number;
  email: string;
  srNumber: string;
  name: string;
  fatherName: string;
  photoUrl: string;
  roleName: string;
  check: boolean;
  active: boolean;
  password : string;

}
export interface ICreateUser {
  id: number;
  email: string;
  userId: string;
  name: string;
  phoneNumber: string;
  userType: string;
  userTypeId: number;
  password: string,
  active: boolean;

}
