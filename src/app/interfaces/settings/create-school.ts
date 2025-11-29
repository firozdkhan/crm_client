
export interface ICreateSchool {
  id: string
  name: string;
  userId : string
  address: string;
  cityId: string;
  stateId: string;
  city: string;
  state: string;
  contactNo: string;
  adminContact: string;
  email: string;
  website: string;
  affilationNo: string;
  registrationNo: string;
  schoolCdoe: string;
  schoolLogo: string;
  signature: string;
  facebook: string;
  youTube: string;
  twitter: string;
  instagram: string;
  activationKey: number;
  activationDate: Date;
  expiryDate: Date;
  isPasswordChanged: boolean;
  isAgree: boolean;
  packageCode: string;
  regionId: number;
  schoolId : number;
  numberOfUsers : number;
  active : boolean;
}
