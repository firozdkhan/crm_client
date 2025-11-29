export interface ISupplier {
  id: number;
  suppliersName: string;
  code: number;
  address: string;
  gstNumber: string;
  phoneNumber: string;
  countryId: number;
  countryName: string;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
  email: string;
  creditPeriod: number;
  creditLimit: number;
  openingBalance: number;
}
