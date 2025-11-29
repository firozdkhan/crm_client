export interface IMenu {
    id: number;
    nameWithParent: string;
    menuName: string;
    iSerialNo: number;
    fabIcon: string;
    parentMenuID: number;
    pageUrl: string;
    child: IMenu[];
  }