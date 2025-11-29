export interface ISocialLink {
    id: number;
    faceBook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
}

export interface IBankDetail {
    id: number;
    bankId: number;
    bankName: string;
    ifsc: string;
    accountNo: string;
    accountName: string;
    accountType: string;
    branchName: string;
    empId: number;
}

export interface IEmployeeDoc {
    id: number;
    documentId: number;
    documentName: string;
    empId: number;
    fileUrl: string;
}

export interface IEmployee {
    id: number;
    name: string;
    emailId: string;
    staffId: number;
    role: string;
    roleName: string;
    designationId: number;
    designation: string;
    departmentId: number;
    department: string;
    gender: string;
    dob: string;
    joiningDate: string;
    currentAddress: string;
    currentCityId: number;
    currentCity: string;
    permanentAddress: string;
    permanentCityId: number;
    permanentCity: string;
    workExperience: string;
    contractTypeId: number;
    contractType: string;
    workShift: string;
    workShiftId: string;
    panNo: string;
    epfNo: string;
    basicSalary: string;
    userName: string;
    fatherName: string;
    motherName: string;
    maritalStatus: boolean;
    mobileNo: string;
    emergencyNo: string;
    photoUrl: string;
    userId: number;
    ml: number;
    cl: number;
    pl: number;
    socialLinkId: number;
    socialLink: ISocialLink;
    bankDetails: IBankDetail;
    employeeDoc: IEmployeeDoc[];
}
