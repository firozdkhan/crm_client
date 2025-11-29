import { ICommonValue } from "../dashboard/common";

 
export interface IMenuList {
  id: number;
  nameWithParent: string;
  menuName: string;
  iSerialNo: number;
  fabIcon: string;
  parentMenuID?: any;
  pageUrl: string;
  menuFor:string;
}



export interface IMenuData {
  menuList: IMenuList[];
  menuDropdown: ICommonValue[];
}

export interface IMenu {
  id:number;
  menuName: string;
  iSerialNo: number;
  fabIcon: string;
  parentMenuID: number;
  pageUrl: string;
}
