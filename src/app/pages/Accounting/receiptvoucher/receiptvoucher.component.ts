import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IReceiptVoucher } from 'src/app/interfaces/accounting/receiptvoucher';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IResponse } from 'src/app/interfaces/response';
import { ISaleMaster } from 'src/app/interfaces/sales/saleMaster';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receiptvoucher',
  templateUrl: './receiptvoucher.component.html',
  styleUrl: './receiptvoucher.component.css',
})
export class ReceiptvoucherComponent {
  receptvouchers: IReceiptVoucher[] = [];
  receptvoucher: IReceiptVoucher;
  parentMenu: ICommonValue[];
  receptvoucherForm: FormGroup;
  parentId: number;
  buttonText: string = 'Submit';
  action: string = 'new';
  today = new Date();
  gridFilter: Array<GridFilter> = [];

  amount?: number;
  actions: Action_Type[] = [
    { class: 'btn-outline-primary', text: null, font: 'fal fa-edit', type: 'edit', tooltip:'Edit' },
    { class: 'btn-outline-danger', text: null, font: 'fal fa-trash-alt', type: 'delete', tooltip:'Delete'},
    { class: 'btn-outline-success', text: null, font: 'fal fa-print', type: 'print',tooltip:'Print' },
  ];
  categories: any[];

  constructor(
    private fb: FormBuilder, private systemService: SystemService, private genericSErvice: GenericService, private trans: TranslatePipe,
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Receipt Invoice', ColumnName: 'receiptInvoiceNo', Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Paid By', ColumnName: 'customerName', Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Amount Pay', ColumnName: 'credit', Type: 'number', Is_Visible: true,Is_Sum :true , });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Edit', ColumnName: 'Action', Type: 'string', Actions: this.actions, Is_Visible: true, });
  }

  ngOnInit(): void {
    this.getNextInvoiceNo();
    this.CreateReceiptVoucherForm();
    this.GetPaymentVoucher();
    this.GetCustomerDroupdown();
    this.GetBankDroupdown();
    this.GetAllRecptData();

    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        const saleId = +params['id'];
        this.loadSaleData(saleId);
      }
    });
  }


  /// Start Load Data in for use navigation Id on ngOnint
  async loadSaleData(saleId: number) {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      `SaleMasterApi/GetById?id=${saleId}`
    );

    if (res.isSuccess && res.data) {
      const sale: ISaleMaster = res.data;
      this.receptvoucherForm.patchValue({
        customerId: sale.customerId,
        receiptDate: this.today.toISOString().split('T')[0],
        credit: sale.balanceDue,
        amount: sale.totalAmount,
      });
    }
  }

  /// End Load Data in for use navigation Id on ngOnint

  //Form Create
  CreateReceiptVoucherForm() {
    this.receptvoucherForm = this.fb.group({
      id: [0],
      receiptInvoiceNo: [null],
      // saleInvoiceNo: [null],

      paymentTypeId: [null,[Validators.required]],
      // paymentTypeName: [null],

      customerId: [null ,[Validators.required]] ,
      // customerName: [null],w

      receiptDate: [null],

      credit: [0 , [Validators.required]],

      // transactionNumber: [null],
      chequeNo: [null],
      chequeDate: [null],
      refreanceNumber: [null],
      longRefreance: [null],
      amount: [{ value: 0, disabled: true }],
    });

    this.receptvoucherForm
      .get('customerId')
      ?.valueChanges.subscribe((customerId) => {
        if (customerId) {
          this.loadBalanceDue(customerId);
        } else {
          this.receptvoucherForm.patchValue({ amount: 0 });
        }
      });
  }

  async GetPaymentVoucher() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'ReceiptVoucher/GetAllInvoiceSetting'
    );
    if (res.isSuccess) {
      console.log(res);
      this.receptvouchers = res.data;
    }
  }

  actionRow(RowItem: any) {
     
    this.receptvoucher = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.receptvoucher.id);
    } else if (this.action === 'edit') {
      this.buttonText = 'Update';
      this.parentId = this.receptvoucher.id;
      this.action = 'edit';

      this.CreateReceiptVoucherForm();

      this.receptvoucherForm.patchValue({
        id: this.receptvoucher.id,
        receiptInvoiceNo: this.receptvoucher.receiptInvoiceNo ?? null,
        saleInvoiceNo: this.receptvoucher.saleInvoiceNo ?? null,
        paymentTypeId: this.receptvoucher.paymentTypeId ?? null,
        paymentTypeName: this.receptvoucher.paymentTypeName ?? null,
        customerId: this.receptvoucher.customerId ?? null,
        customerName: this.receptvoucher.customerName ?? null,
        receiptDate: this.receptvoucher.receiptDate
          ? new Date(this.receptvoucher.receiptDate).toISOString().split('T')[0]
          : null,
        debit: this.receptvoucher.debit ?? 0,
        credit: this.receptvoucher.credit ?? 0,
        transactionNumber: this.receptvoucher.transactionNumber ?? null,
        chequeNo: this.receptvoucher.chequeNo ?? null,
        chequeDate: this.receptvoucher.chequeDate
          ? new Date(this.receptvoucher.chequeDate).toISOString().split('T')[0]
          : null,
        refreanceNumber: this.receptvoucher.refreanceNumber ?? null,
        longRefreance: this.receptvoucher.longRefreance ?? null,
      });
    } else if (this.action === 'print') {
      this.buttonText = 'Print';
      this.router.navigate(['/accounting/printreceiptvoucher'], {
        queryParams: { Id: this.receptvoucher.id },
      });
    }
  }

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
        const url = `ReceiptVoucher/DeleteReceiptVoucher/${miscId}`;

        const res = await this.genericSErvice.ExecuteAPI_Delete<IResponse>(url);

        if (res && res.isSuccess) {
          this.receptvouchers = this.receptvouchers.filter(
            (category) => category.id !== miscId
          );
          Swal.fire(
            this.trans.transform('Deleted!'),
            this.trans.transform('Your record has been deleted.'),
            'success'
          );
        } else {
          this.toastr.error(res?.message || 'Failed to delete record');
        }
      }
    });
  }

  async onSubmit() {
     
    if (this.receptvoucherForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const PaymentData: IReceiptVoucher = this.receptvoucherForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'ReceiptVoucher/AddNewReceiptInvoice',
        PaymentData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetPaymentVoucher();
        await this.CreateReceiptVoucherForm();
        await this.GetAllRecptData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.receptvoucherForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const PaymentData: IReceiptVoucher = this.receptvoucherForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'ReceiptVoucher/UpdateReceiptVoucher',
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
    this.CreateReceiptVoucherForm();
    this.receptvoucherForm.reset();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  async loadBalanceDue(customerId: number) {
     
    await this.genericSErvice
      .ExecuteAPI_Get<IResponse>(
        `ReceiptVoucher/GetCustomerAmountById?customerid=${customerId}`
      )
      .then((res) => {
        if (res.isSuccess) {
          this.receptvoucherForm.patchValue({ amount: res.data });
        } else {
          this.receptvoucherForm.patchValue({ amount: 0 });
        }
      })
      .catch((err) => {
        this.receptvoucherForm.patchValue({ amount: 0 });
      });
  }

  customerdroupdown: any[] = [];
  async GetCustomerDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'CustomerApi/GetCustomerDropdown'
    );
    if (res) {
      this.customerdroupdown = res.data;
    }
  }

  bankdroupdown: any;
  async GetBankDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'BankDetailsApi/GetBankDropdown'
    );
    if (res.isSuccess) {
      this.bankdroupdown = res.data;
    }
  }

  async getNextInvoiceNo() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'ReceiptVoucher/GetNextPaymentInvoiceNumber'
    );

    if (res) {
      this.receptvoucherForm.get('receiptInvoiceNo')?.setValue(res.invoiceNo);
    }
  }

  async GetAllRecptData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'ReceiptVoucher/GetAllReceiptVouchers'
    );

    if (res.isSuccess) {
      this.receptvouchers = res.data;
    }
  }
}
