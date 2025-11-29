import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'changeDate'
})
export class ChangeDatePipe  implements PipeTransform {
  
  constructor(private cp: DatePipe) {
  }
  
   

  transform(value: any, ...args: unknown[]): any {

    if(value instanceof Date) {
      return this.cp.transform(value, 'yyyy-MM-dd')
    }
    else
    {
      let date = parse(value, environment.dateFormat, new Date());      
      return this.cp.transform(date, 'yyyy-MM-dd')
    };


    
  }

}
