
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { IMenu } from 'src/app/interfaces/dashboard/menu';
 




@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ul[sidebarmenu]',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
// tslint:disable-next-line:class-name
export class SidebarMenuComponent implements OnInit {

  @Input() sidebarmenu: IMenu[];

  constructor(private titleService: Title) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {


  }
  public setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }


}
