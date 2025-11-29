// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  studentProfileImage: 'assets/img/profile/student-profile.png',
  fatherProfileImage: 'assets/img/profile/father-profile.png',
  motherProfileImage: 'assets/img/profile/mother-profile.png',
  gardianProfileImage: 'assets/img/profile/gardian-profile.png',
  imageIcon: 'assets/img/images/imageIcon.jpg',
  noImage: 'assets/img/noimage.jpg',
  imagePath: 'assets/img/images/',

  apiUrl: 'http://localhost:5000/api/',
  Base_API_URL: 'http://localhost:5000/',
  Base_File_Path: 'http://localhost:5000/Content/',
  Site_URL: 'http://localhost:5000/',
  hubUrl: 'http://localhost:5000/hubs/',
  feeUrl: 'http://localhost:4200/fee/fees-payment-web',
  Expiration_Time: 60,
  // SessionId: 8,
  dateFormat: 'dd MMM yyyy',
  datePickerFormat: 'DD MMM YYYY',
  currencyFormat: 'AED ',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
