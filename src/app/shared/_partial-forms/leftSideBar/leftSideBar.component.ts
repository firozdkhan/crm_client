



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';


import { IMenu } from 'src/app/interfaces/dashboard/menu';
import { StoredDataService } from 'src/app/services/stored-data.service';
@Component({
  selector: 'app-leftSideBar',
  templateUrl: './leftSideBar.component.html',
  styleUrls: ['./leftSideBar.component.scss']
})

export class LeftSideBarComponent implements OnInit {

  constructor(
    private sharedService: StoredDataService,
    private router: Router
  ) { }

  menu: IMenu[];




  ngOnInit() {

    this.getMenus();


  }

  getMenus() {
    this.sharedService.getSideMenu().subscribe(response => {
      this.menu = response.data;
    }, error => {
      console.log(error);
    }
    );
  }

}
