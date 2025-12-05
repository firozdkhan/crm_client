import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  IExpensesReport,
  ExpensesReportDetail,
} from 'src/app/interfaces/Report/expensesreport';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { IBankDetails } from 'src/app/interfaces/accounting/bankdetails';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expensesreport',
  templateUrl: './expensesreport.component.html',
  styleUrls: ['./expensesreport.component.css'],
})
export class ExpensesreportComponent implements OnInit {
  expensesForm!: FormGroup;
  bankData: any[] = [];
userData: ICommonValue[] = [];

  bankList: IBankDetails[];
  selectedBankId: number;
  action: string = 'new';
  buttonText: string = 'Submit';
  companyProfile: ISchoolProfile;
  expensesss: IExpensesReport[] = [];
  expense: IExpensesReport;
  selectedExpenseId: number | null = null;
  actions: Action_Type[] = [
    {class: 'btn-outline-primary',text: null,font: 'fal fa-edit',type: 'edit', tooltip : 'Edit'},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',tooltip : 'Delete'},
    {class: 'btn-outline-success',text: null,font: 'fal fa-print',type: 'print',tooltip : 'Print'},
  ];
  categories: any[];
  gridFilter: Array<GridFilter> = [];

  constructor(private fb: FormBuilder,private toastr: ToastrService,private router: Router,private genericService: GenericService,private datepipe :DatePipe
  ) {
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Invoice no', ColumnName: 'invoiceNo', Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Date', ColumnName: 'expenseDate', Type: 'date', Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Payment Type', ColumnName: 'bankName', Type: 'string', Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Description', ColumnName: 'description',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Amount',ColumnName: 'totalAmount',Type: 'number', Is_Visible: true, Is_Sum: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Edit',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});

    this.categories = [];
  }

  ngOnInit(): void {
    this.createExpensesForm();
    this.getNextInvoiceNumber();
    this.getBankDetails();
    this.loadExpenseReports();
    this.GetDroupdown();
    this.loadCompanyProfile();
    this.getUserDetails();
  }

  createExpensesForm(): void {
    this.expensesForm = this.fb.group({
      id: [0],
      invoiceNo: [''],
      expenseDate: [new Date().toISOString().substring(0, 10)],
      userId: [null, Validators.required],
      bankId: [null, Validators.required],
      description: [''],
      totalAmount: [0],
      expensesReportDetails: this.fb.array([]),
    });

    this.addExpenseRow();
  }

  get expensesReportDetails(): FormArray {
    return this.expensesForm.get('expensesReportDetails') as FormArray;
  }
  addExpenseRow(detail?: ExpensesReportDetail): void {
    const row = this.fb.group({
      id: [0],
      expensesId: [null],
      expensesReport: [null],
      expensesTypeId: [null, Validators.required],
      expensesTypeName: [null],
      expenseAmount: [null, [Validators.required, Validators.min(1)]],
      expensesDescription: [null],
    });

    this.expensesReportDetails.push(row);
  }
  removeExpenseRow(index: number): void {
    if (this.expensesReportDetails.length > 1) {
      this.expensesReportDetails.removeAt(index);
      this.calculateTotalAmount();
    }
  }

  calculateTotalAmount(): void {
    const total = this.expensesReportDetails.controls.reduce((sum, group) => {
      return sum + (group.get('expenseAmount')?.value || 0);
    }, 0);

    this.expensesForm.get('totalAmount')?.setValue(total);
  }

  async getNextInvoiceNumber() {
    try {
      const res = await this.genericService.ExecuteAPI_Get<any>(
        'Expense/GetNextInvoiceNumber'
      );
      if (res?.invoiceNo) {
        this.expensesForm.get('invoiceNo')?.setValue(res.invoiceNo);
      }
    } catch (error) {
      console.error('Invoice number fetch failed', error);
    }
  }

  async onSubmit() {
     
    if (this.expensesForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const expenseData: IExpensesReport = this.expensesForm.value;

    if (this.action === 'new') {
      const res = await this.genericService.ExecuteAPI_Post<IResponse>(
        'Expense/AddExpensesReport',
        expenseData
      );

      if (res?.isSuccess) {
        this.toastr.success('Expense report saved successfully.');
        await this.loadExpenseReports();
        this.cancel();
        this.router.navigate(['report/expensesreportprint', res.data.id]);
      } else {
        this.toastr.error(res?.message || 'Failed to save expense report.');
      }
    } else if (this.action === 'edit') {
      await this.editExpense();
    }
  }

  async editExpense() {
    if (this.expensesForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const expenseData: IExpensesReport = this.expensesForm.value;

    const res = await this.genericService.ExecuteAPI_Put<IResponse>(
      'Expense/UpdateExpensesReport',
      expenseData
    );

    if (res?.isSuccess) {
      this.toastr.success('Expense report updated successfully.');
      await this.loadExpenseReports();
      this.cancel();
      this.router.navigate(['report/expensesreportprint', res.data.id]);
    } else {
      this.toastr.error(res?.message || 'Failed to update expense report.');
    }
  }

  parentId: number;

  actionRow(RowItem: any) {
     
    this.expense = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteExpense(this.expense.id);
    } else if (this.action === 'edit') {
       
      this.buttonText = 'Update';
      this.parentId = this.expense.id;

      this.expensesForm.patchValue({
        id: this.expense.id,
        invoiceNo: this.expense.invoiceNo,
        expenseDate: this.expense.expenseDate ? this.datepipe.transform(this.expense.expenseDate , 'dd MMM yyyy'): null,
        bankId: this.expense.bankId.toString(),
        description: this.expense.description,
        totalAmount: this.expense.totalAmount,
      });

      this.setExpenseDetails(this.expense.expensesReportDetails);
    } else if (this.action === 'print') {
      this.router.navigate(['report/expensesreportprint', this.expense.id]);
    }
  }

  setExpenseDetails(details: any[]) {
    const detailFormArray = this.expensesForm.get(
      'expensesReportDetails'
    ) as FormArray;
    detailFormArray.clear();

    details.forEach((detail) => {
      detailFormArray.push(
        this.fb.group({
          id: [detail.id],
          expensesId: [detail.expensesId],
          expensesTypeId: [detail.expensesTypeId],
          expensesTypeName: [detail.expensesTypeName],
          expenseAmount: [detail.expenseAmount, Validators.required],
          expensesDescription: [detail.expensesDescription],
        })
      );
    });
  }

  async deleteExpense(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let params = new HttpParams().set('id', id.toString());

        try {
          const res = await this.genericService.ExecuteAPI_Delete<IResponse>(
            'Expense/DeleteExpenses',
            params
          );

          if (res?.isSuccess) {
            await this.loadExpenseReports();
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
          } else {
            this.toastr.error(res?.message || 'Failed to delete record');
          }
        } catch (err) {
          this.toastr.error('Something went wrong while deleting.');
        }
      }
    });
  }

  cancel() {
    this.createExpensesForm();
    this.expensesForm.reset();
    this.action = 'new';
    this.buttonText = 'Submit';
    this.selectedExpenseId = null;
  }

  async getBankDetails() {
    try {
      const response = await this.genericService.ExecuteAPI_Get<IResponse>(
        'BankDetailsApi/GetAllBankDetails'
      );
      if (response && response.data) {
        this.bankList = response.data as IBankDetails[];

        this.bankData = this.bankList.map(
          (p) =>
            <ICommonValue>{
              id: p.id.toString(),
              name: p.bankName,
            }
        );
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  }

  async getUserDetails() {
    try {
      const response = await this.genericService.ExecuteAPI_Get<IResponse>(
        'Core/GetUsers'
      );
      if (response && response.data) {        

        this.userData =  response.data;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }
  onBankChange(event: any) {
    this.selectedBankId = +event.target.value;
  }

  async loadExpenseReports() {
     
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Expense/GetAllExpensesReports'
    );
    if (res.isSuccess) {
      this.expensesss = res.data;
    } else {
      this.expensesss = [];
    }
  }

  resetForm() {
    this.expensesForm.reset();
    this.action = 'new';
    this.buttonText = 'Submit';
  }

  products: any[] = [];
  isEditMode: boolean = false; // agar edit mode hai to true set karein
  editData: any; // isme aapko edit object assign karna hoga jab edit button pe click ho

  async GetDroupdown() {
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Expense/GetExpensesDroupDown'
    );

    if (res.isSuccess) {
      this.products = res.data;
      console.log('Products Dropdown:', this.products);

      // Agar edit mode hai to patch karo
      if (this.isEditMode) {
        this.setEditData();
      }
    }
  }
  form: FormGroup;
  setEditData() {
    this.form.patchValue({
      expensesTypeId: this.editData?.expensesTypeId || null,
    });
  }

  countryid: any;
  currencyname: string = '';
  async loadCompanyProfile() {
     
    let res = await this.genericService.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.countryId;
      this.companyProfile = res;
      this.getCountryById(this.countryid);
    }
  }

  async getCountryById(id: number) {
    let response = await this.genericService.ExecuteAPI_Get<IResponse>(
      `Core/GetCountryById/${id}`
    );

    if (response.isSuccess) {
      this.currencyname = response.data.currency;
      console.log(this.currencyname);
    }
  }
}
