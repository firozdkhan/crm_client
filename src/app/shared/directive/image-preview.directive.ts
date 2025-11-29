import { Directive, ElementRef, Input,   OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appImagePreview]'
})
export class ImagePreviewDirective {

  @Input() private media: any;
  @Input() private type: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {

      let reader = new FileReader();
      let el = this.el;

      if (this.type === 'application/pdf') {
          reader.onloadend = function (e) {
              el.nativeElement.data = reader.result;
          };
      } else if (this.type.split('/')[0] === 'image') {
          reader.onloadend = function (e) {
              el.nativeElement.src = reader.result;
          };
      }


      if (this.media) {
          return reader.readAsDataURL(this.media);
      }

  }
}


