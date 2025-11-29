import { Component, EventEmitter, Input, OnInit, Output, } from "@angular/core";
import { NodeItem, TreeCallbacks, TreeMode, TreeNgx, TreeOptions } from "tree-ngx";







@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view-menu.component.html',
  styleUrls: ['./tree-view-menu.component.scss']
})
export class TreeViewMenuComponent implements OnInit {

  @Output("selectChange") selectChange: EventEmitter<any> = new EventEmitter<any>();



  public firstTreecallbacks: TreeCallbacks;
  public firstTreeoptions: TreeOptions;
  public firstSelectedItems: any[];
  @Input("menuItems") menuItems: NodeItem<string>[];



  ngOnInit() {


    console.log(this.menuItems);

    this.firstTreeoptions = {
      checkboxes: true,
      mode: TreeMode.MultiSelect,
      alwaysEmitSelected: true
    };

    this.firstTreecallbacks = {
      toggle: this.onNameClick,
    };


  }


  public selecedItemsChanged(items: NodeItem<string>[]) {
    this.firstSelectedItems = items;
    this.selectChange.emit({ selectedPermissions: items });


  }













  private onNameClick(item: NodeItem<any>) {

  }





}
