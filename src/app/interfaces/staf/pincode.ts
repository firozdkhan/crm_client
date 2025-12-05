export interface IPincodesData {
    pincode: string;
    office_Name: string;
    division: string;
    region: string;
    circle: string;
    clientId: number;
    coordinates: IPinCodeCoordinates[];
}

export interface IPinCodeCoordinates {
    latitute: string;
    longidute: string;
}
