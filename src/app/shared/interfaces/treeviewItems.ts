export interface ITreeViewItem {
    id: number;
    name: string;
    children: ITreeViewItem[];     
    selected?: boolean;
    expanded?: boolean;
    disabled?: boolean;
  }