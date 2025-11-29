import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPaymentVoucher } from 'src/app/interfaces/accounting/paymentvoucher';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IPurchaseMaster } from 'src/app/interfaces/Purchase/purchaseMaster';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paymentvoucher',
  templateUrl: './paymentvoucher.component.html',
  styleUrl: './paymentvoucher.component.css',
})
export class PaymentvoucherComponent {
  paymentvouchers: IPaymentVoucher[] = [];
  paymentvoucher: IPaymentVoucher;
  parentMenu: ICommonValue[];
  paymentvoucherForm: FormGroup;
  parentId: number;
  buttonText: string = 'Submit';
  action: string = 'new';
  today = new Date();
  gridFilter: Array<GridFilter> = [];

  amount?: number;
  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit', tooltip:'Edit'},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete', tooltip:'Delete'},
    {class: 'btn-outline-success',text: null,font: 'fal fa-print',type: 'print', tooltip:'print'},
  ];
  categories: any[];
  constructor(private fb: FormBuilder,private systemService: SystemService,private genericSErvice: GenericService,private trans: TranslatePipe,
    private toastr: ToastrService,private router: Router,private route: ActivatedRoute

  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Payment Invoice', ColumnName: 'paymentInvoiceNo',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Paid For',ColumnName: 'supplierName',Type: 'string',Is_Visible: true,});
    // this.gridFilter.push(<GridFilter>{ //   DisplayText: 'PaymantType', //   ColumnName: 'accountType',//   Type: 'string', //   Is_Visible: true,
    // });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Amount Pay',ColumnName: 'debit', Type: 'number', Is_Visible: true, Is_Sum :true ,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit',ColumnName: 'Action',Type: 'string', Actions: this.actions, Is_Visible: true,});
  }

  ngOnInit(): void {
    this.getNextInvoiceNo();
    this.CreatePaymentVoucherForm();
    this.GetPaymentVoucher();
    this.GetSupplierDroupdown();
    this.GetBankDroupdown();
     this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        const purchaseId = +params['id'];
        this.loadPurchaseData(purchaseId);
      }
    });
  }



   /// Start Load Data in for use navigation Id on ngOnint
  async loadPurchaseData(purchaseId: number) {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      `PurchaseMaster/GetById?id=${purchaseId}`
    );

    if (res.isSuccess && res.data) {
      const purchase: IPurchaseMaster = res.data;


      this.paymentvoucherForm.patchValue({
        supplierId: purchase.supplierId,
        paymentDate: this.today.toISOString().split('T')[0],
        debit: purchase.balanceDue,
        amount: purchase.totalAmount,
      });
    }
  }
 /// End Load Data in for use navigation Id on ngOnint



  //Form Create
  CreatePaymentVoucherForm() {
     
    this.paymentvoucherForm = this.fb.group({
      id: [0],
      paymentTypeId: [null,[Validators.required]],
      paymentType: [null,[Validators.required]],
      paymentInvoiceNo: [null],
      supplierId: [null ,[Validators.required]],
      paymentDate: [null ,[Validators.required]],
      debit: [null ,[Validators.required]],
      amount: [{ value: 0, disabled: true }],
    });

    this.paymentvoucherForm
      .get('supplierId')
      ?.valueChanges.subscribe((supplierId) => {
        if (supplierId) {
          this.loadBalanceDue(supplierId);
        } else {
          this.paymentvoucherForm.patchValue({ amount: 0 });
        }
      });
  }

  async GetPaymentVoucher() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'PaymentVoucher/GetAllInvoiceSetting'
    );
    if (res.isSuccess) {
      console.log(res);
      this.paymentvouchers = res.data;
    }
  }

  actionRow(RowItem: any) {
    this.paymentvoucher = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.paymentvoucher.id);
    } else if (this.action == 'edit') {
      this.buttonText = 'Update';
      this.parentId = this.paymentvoucher.id;
      this.action = 'edit';

      this.CreatePaymentVoucherForm();

      this.paymentvoucherForm.patchValue({
        id: this.paymentvoucher.id,
        paymentTypeId: this.paymentvoucher.paymentTypeId ?? null,
        paymentType: this.paymentvoucher.paymentType ?? null,
        paymentInvoiceNo: this.paymentvoucher.paymentInvoiceNo ?? null,
        supplierId: this.paymentvoucher.supplierId ?? null,
        paymentDate: this.paymentvoucher.paymentDate
          ? new Date(this.paymentvoucher.paymentDate)
              .toISOString()
              .split('T')[0]
          : null,
        debit: this.paymentvoucher.debit ?? null,
        // agar amount use nahi ho raha, toh hata hi do ya add karo interface me
        // amount: this.paymentvoucher.amount ?? 0
      });
    } else if ((this.action = 'print')) {
      this.buttonText = 'Print';
      this.router.navigate(['/accounting/printpaymentvoucher'], {
        queryParams: { Id: this.paymentvoucher.id },
      });
      console.log(this.paymentvoucher);
    }
  }

  async onSubmit() {
     
    if (this.paymentvoucherForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const PaymentData: IPaymentVoucher = this.paymentvoucherForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'PaymentVoucher/AddNewPaymentInvoice',
        PaymentData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetPaymentVoucher();
        await this.CreatePaymentVoucherForm();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.paymentvoucherForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const PaymentData: IPaymentVoucher = this.paymentvoucherForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'PaymentVoucher/UpdatePaymentInvoice',
      PaymentData
    );

    if (res.isSuccess) {
      this.toastr.success('Payment Voucher updated successfully');
      await this.GetPaymentVoucher();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }
  cancel() {
    this.CreatePaymentVoucherForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  //////////////////////////////////// Get Invoice no ///////////////////////////////////

  async getNextInvoiceNo() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'PaymentVoucher/GetNextPaymentInvoiceNumber'
    );

    if (res) {
      this.paymentvoucherForm.get('paymentInvoiceNo')?.setValue(res.invoiceNo);
    }
  }

  //////////////////////////////////////// End ////////////////////////////

  async loadBalanceDue(supplierId: number) {
     
    await this.genericSErvice
      .ExecuteAPI_Get<IResponse>(
        `PaymentVoucher/GetSupplierAmountById?supplierId=${supplierId}`
      )
      .then((res) => {
        if (res.isSuccess) {
          this.paymentvoucherForm.patchValue({ amount: res.data });
        } else {
          this.paymentvoucherForm.patchValue({ amount: 0 });
        }
      })
      .catch((err) => {
        this.paymentvoucherForm.patchValue({ amount: 0 });
      });
  }

  /////////////////////////////////// delete fucntion  ///////////////////////////////////

  async deleteMenu(miscId: number) {
     
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set('id', miscId.toString());
        let res = await this.genericSErvice.ExecuteAPI_Delete(
          'PaymentVoucher/DeletePaymentVoucher',
          params
        );
        if (res && res) {
          this.paymentvouchers = this.paymentvouchers.filter(
            (category) => category.id !== miscId
          );
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your record has been deleted.'),
            'success'
          );
        } else {
          this.toastr.error('Failed to delete record');
        }
      }
    });
  }

  supplierdroupdown: any[] = [];
  async GetSupplierDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'SupplierApi/GetSupplierDropdown'
    );
    if (res) {
      this.supplierdroupdown = res.data;
    }
  }
  bankdroupdown: any;
  async GetBankDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'BankDetailsApi/GetBankDropdown'
    );
    if (res.isSuccess) {
      this.bankdroupdown = res.data;
      console.log(this.bankdroupdown);
    }
  }
}
