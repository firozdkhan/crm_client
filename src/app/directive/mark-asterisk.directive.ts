import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appMarkAsterisk]'
})
export class MarkAsteriskDirective implements OnInit {
  @Input() appMarkAsterisk: boolean;


  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) {

  }

  ngOnInit(): void {
    // clear view if no roles
    if (!this.appMarkAsterisk) {
      this.viewContainerRef.clear();
      return;
    }

    if (this.appMarkAsterisk) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }  
  }


}
