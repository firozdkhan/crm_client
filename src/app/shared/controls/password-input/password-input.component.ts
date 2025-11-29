import { Component, ElementRef, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css'
})
export class PasswordInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() type = 'password';
  @Input() label = 'string';
  @Input() placeHolder: string;
  @Input() isDisabled: boolean = false;
  @Input() inputValue: string = null;

  @Input() maxLength:number = 50;

  constructor(@Optional() @Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }
  isreq: boolean;
  isOldPasswordVisible: boolean = false;

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
    control.addValidators([Validators.minLength(1), Validators.maxLength(this.maxLength)]);


  }

  public noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length? null : { 'whitespace': true };
}

  onChange(event) {


   }

  onTouched() {

  }

  writeValue(obj: any): void {
   
      this.input.nativeElement.value = obj || "";
    
  



  }

  registerOnChange(fn: any): void {
    this.onChange = fn;


  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;


  }

  focusOutFunction(event:any){


// this.input.nativeElement.value = " " ? null : this.inputValue;

// this.inputValue = this.input.nativeElement.value;



    // console.log(this.input.nativeElement.value);
    // console.log(this.inputValue)

  }

  get validator() {
    if (this.controlDir.control.validator) {
      const validator = this.controlDir.control.validator({} as AbstractControl);

      if (validator) {

        if (validator.required) {
          //  this.controlDir.control.addValidators([this.noWhitespaceValidator]);
          return true;
        }
        else { return false }
      }
      else {
        return false
      }
    }
    else {
      return false
    }

    
  }

  toggleVisibility() {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
     if(this.type=='password')
       {
        this.type="text";
     }
     else { 
      this.type="password";
    }
     
      
       
     
  }

}

