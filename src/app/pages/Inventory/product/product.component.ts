import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IProduct } from 'src/app/interfaces/inventory/product';
import { IResponse } from 'src/app/interfaces/response';
import { GenericService } from 'src/app/services/generic.service.service';
import { SystemService } from 'src/app/shared/controls/grid/SystemService';
import { Action_Type, GridFilter } from 'src/app/shared/models/common_model';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  products: IProduct[] = [];  product: IProduct;  parentMenu: ICommonValue[];  productForm: FormGroup;  parentId: number;  buttonText: string = 'Submit';
  action: string = 'new';
  today = new Date();
  gridFilter: Array<GridFilter> = [];
  actions: Action_Type[] = [
    {class: 'btn-outline-primary', text: null, font: 'fal fa-edit',type: 'edit',},
    {class: 'btn-outline-danger',text: null,font: 'fal fa-trash-alt',type: 'delete',},
  ];
  categories: any[];

  constructor(
    private fb: FormBuilder, private systemService: SystemService,private genericSErvice: GenericService,private trans: TranslatePipe,
    private toastr: ToastrService
  ) {
    this.gridFilter.push(<GridFilter>{DisplayText: 'Product Name', ColumnName: 'productsName', Type: 'string', Is_Visible: true, });
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Product Code', ColumnName: 'productCode',Type: 'number', Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'HSN Code',ColumnName: 'hsnCode',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Category Name',ColumnName: 'categoryName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Unit Name', ColumnName: 'unitName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Brand Name',ColumnName: 'brandName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Quantity Alert',ColumnName: 'quantityAlert',Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Stock', ColumnName: 'openStock', Type: 'number',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Add Date',ColumnName: 'currentDate', Type: 'date', Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Purchase Price', ColumnName: 'purchasePrice', Type: 'number', Is_Visible: true, Is_Sum :true });
    this.gridFilter.push(<GridFilter>{DisplayText: 'Selling Price',ColumnName: 'sellingPrice',Type: 'number',Is_Visible: true,Is_Sum :true});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Tax Name',ColumnName: 'taxName',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{ DisplayText: 'Description',ColumnName: 'description',Type: 'string',Is_Visible: true,});
    this.gridFilter.push(<GridFilter>{DisplayText: 'Edit',ColumnName: 'Action',Type: 'string',Actions: this.actions,Is_Visible: true,});

    this.categories = [];
  }

  ngOnInit(): void {
    this.CreateProductForm();
    this.GetProductData();
  }

  //Form Create
  CreateProductForm() {
    this.productForm = this.fb.group({
      id: [0],
      productsName: [null, Validators.required],
      productCode: [null],
      categoryId: [null],
      unitId: [null],
      brandId: [null],
      quantityAlert: [null],
      openStock: [null],
      currentDate: [this.today],
      purchasePrice: [null],
      sellingPrice: [null],
      taxId: [null],
      description: [null],
      hsnCode: [null],
    });
  }

  //GetData
  async GetProductData() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'ProductApi/GetAllProduct'
    );
    if (res.data) {
      this.products = res.data;
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
        let params = new HttpParams().set('id', miscId.toString());
        let res = await this.genericSErvice.ExecuteAPI_Delete(
          'ProductApi/DeleteProduct',
          params
        );
        if (res && res) {
          this.products = this.products.filter(
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

  actionRow(RowItem: any) {
    this.product = RowItem.item;
    this.action = RowItem.action;

    if (this.action === 'delete') {
      this.deleteMenu(this.product.id);
    } else {
      this.buttonText = 'Update';
      this.productForm.patchValue(this.product);
      this.parentId = this.product.unitId;
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }
    const ProductData: IProduct = this.productForm.value;

    if (this.action === 'new') {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'ProductApi/AddNewProduct',
        ProductData
      );
      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.GetProductData();
        this.cancel();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } else if (this.action === 'edit') {
      await this.editcategory();
    }
  }

  async editcategory() {
     
    if (this.productForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const taxData: IProduct = this.productForm.value;

    const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
      'ProductApi/UpdateProduct',
      taxData
    );

    if (res.isSuccess) {
      this.toastr.success('Category updated successfully');
      await this.GetProductData();
      this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update category');
    }
  }

  cancel() {
    this.CreateProductForm();
    this.action = 'new';
    this.buttonText = 'Submit';
  }
}
