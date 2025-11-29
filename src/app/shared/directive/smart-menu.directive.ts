import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AfterViewInit, Directive, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[appSmartMenu]'
})
export class SmartMenuDirective implements AfterViewInit {
  private $menu: any;
  getMenu: ElementRef;

  constructor(
    private router: Router, el: ElementRef
  ) {
    this.getMenu = el;
    this.$menu = $(this.getMenu.nativeElement);
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    // console.log('Add Menu' + this.setMenu);
    // console.log(this.setMenu.children);
    // for (const eachChild of this.setMenu.children) {
    //   if (eachChild('ul').length) {
    //     console.log('Has Child');
    //     // el has a ul as an immediate descendant
    // }
    //   }


    const $menuItem: any = this.$menu;
    const $a = $menuItem.find('>a');
    const sign = $('<b class="collapse-sign"><em class="fal fa-angle-down"></em></b>');

    $a.on('click', (e) => {
      this.toggle($menuItem);
      e.stopPropagation();
      return false;
    }).append(sign);


  }
  // tslint:disable-next-line:typedef
  private toggle($el, condition = !$el.data('open')) {
    $el.toggleClass('open', condition);

    if (condition) {
      $el.find('>ul').slideDown();
    } else {
      $el.find('>ul').slideUp();
    }



    $el.data('open', condition);

    if (condition) {
      $el.siblings('.open').each((i, it) => {
        const sib = $(it);
        this.toggle(sib, false);
      });
    }
  }

}
