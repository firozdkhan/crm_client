import { Directive, ElementRef, Input, OnInit } from '@angular/core';
    
@Directive({
  selector: '[appPrefixFocusAndSelect]',
})
export class FocusOnShowDirective implements OnInit { 
  
  @Input('checkFocusStatus') checkFocusStatus:boolean=false;  

  
  constructor(private el: ElementRef) {
    if (!el.nativeElement['focus']) {
      throw new Error('Element does not accept focus.');
    }
  }
    
  ngOnInit(): void {
    
    if(this.checkFocusStatus) {
      const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
      input.focus();
      input.select();
    }
   
  }
}
