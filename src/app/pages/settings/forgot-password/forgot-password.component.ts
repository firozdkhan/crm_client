import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GenericService } from 'src/app/services/generic.service.service';
import { IToastyMessage } from 'src/app/shared/interfaces/toasty-message';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private router: Router,
    private toastr: ToastrService
  ) { }
  singinForm: FormGroup;



  ngOnInit(): void {


    this.createForm();
  }



  getthis() {

  }


  createForm() {
    this.singinForm = new FormGroup({
      userId: new FormControl(null, Validators.required)

    });
  }

  async onSubmit() {



    let res = await this.genericService.ExecuteAPI_Post<IToastyMessage>("Users/ForgotPassword", this.singinForm.value);
    if (res.isSuccess) {

      this.router.navigate(['/reset-password'], { queryParams: { id: res.data.id, refId: res.data.refId } })

      console.log(res.data);
    } else {
      this.toastr.error(res.message)
    }




  }

  cancel() {
    this.createForm();
  }

}
