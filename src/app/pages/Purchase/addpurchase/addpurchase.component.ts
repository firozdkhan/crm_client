import { DatePipe } from '@angular/common';
import { IPurchaseMaster } from './../../../interfaces/Purchase/purchaseMaster';
import { IBankDetail } from './../../../interfaces/staf/staff';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBankDetails } from 'src/app/interfaces/accounting/bankdetails';
import { IInvoiceSetting } from 'src/app/interfaces/configuration/invoicesetting';
import { ITax } from 'src/app/interfaces/configuration/tax';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IProduct } from 'src/app/interfaces/inventory/product';
import { IPurchaseDetail } from 'src/app/interfaces/Purchase/purchaseMaster';
import { IResponse } from 'src/app/interfaces/response';
import { ISchoolProfile } from 'src/app/interfaces/settings/school-profile';
import { GenericService } from 'src/app/services/generic.service.service';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addpurchase',
  templateUrl: './addpurchase.component.html',
  styleUrls: ['./addpurchase.component.css'],
})
export class AddpurchaseComponent implements OnInit {
  purchaseForm!: FormGroup;
  products: IProduct[] = [];
  suppliers: any[] = [];
  taxs: ITax[] = [];
  bankList: IBankDetails[] = [];
  selectedBankId!: number;
  isUpdateDisabled: boolean = true;
  isSubmitDisabled: boolean = false;
  purchaseData: any;
  productData: ICommonValue[];
  bankData: ICommonValue[];

  companyprofile: ISchoolProfile;

  //  Invoice Setting//
  invoicesettings: IInvoiceSetting[] = [];
  invoicesetting: IInvoiceSetting;

  purchases: IPurchaseMaster[] = [];
  purchase: IPurchaseMaster;

  purchasedetails: IPurchaseDetail[] = [];
  addNewProduct: FormGroup;
  today: Date = new Date();
  showAddProductForm = false; //AddProduct
  http: any;

  constructor(
    private fb: FormBuilder,
    private genericSErvice: GenericService,
    private trans: TranslatePipe,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe :DatePipe
  ) {}

  ngOnInit() {
    this.getNextInvoiceNo();
    this.GetSupplierDroupdown();

    this.purchaseForm = this.fb.group({
      id: [0],
      invoiceNo: ['', Validators.required],
      supplierId: ['', Validators.required],
      suppliersName: [''],
      purchaseDate: ['', Validators.required],
      modifyDate: [''],
      purchaseInvoiceNumber: [''],
      totalTaxAmount: [0],
      totalProductDiscount: [0],
      billDiscount: [0],
      shippingAmount: [0],
      totalAmount: [0],
      netAmount: [0],
      payAmount: [0],
      balanceDue: [0],
      grandtotal: [0],
      status: ['Pending'],
      bankId: [null],
      billDescription: [null],
      purchaseDetails: this.fb.array([]),
    });

    //////// Tax form on product select /////
    this.editTaxForm = this.fb.group({
      taxId: [null, Validators.required],
    });
    /////////////

    this.getTaxData();
    this.loadCompanyProfile();

    /////////////// use for navigate on purchase Invoice View Page /////////////////////

    // const navigation = this.router.getCurrentNavigation();

    // this.purchaseData = history.state.data;

    // if (this.purchaseData) {
    //    
    //   this.purchaseForm.patchValue(this.purchaseData);

    //   this.GetPurchaseMasterById(this.purchaseData.id);
    //   this.isUpdateDisabled = false;
    //   this.isSubmitDisabled = true;
    // }
    this.route.queryParams.subscribe((params) => {
      const invoiceNo = params['invoiceNo'];
      if (invoiceNo) {
        this.getPurchaseByInvoiceNo(invoiceNo);
      } else {
        console.warn('invoiceNo not found');
      }
    });

    ///////// use for cautch invoice no. on edit  and run edit condition /////
    this.route.queryParams.subscribe((params) => {
      const invoiceNo = params['invoiceNo'];
      if (invoiceNo) {
        this.getPurchaseByInvoiceNo(invoiceNo);
      }
    });

    /////////////////////////////// edit invoice end ////////////////////////////

    ////////////////////////////// New Product Add Form start ////////////////////

    this.addNewProduct = this.fb.group({
      productsName: ['', Validators.required],
      categoryId: [''],
      unitId: [''],
      brandId: [''],
      taxId: [''],
      productCode: [''],
      quantityAlert: [''],
      openStock: [''],
      currentDate: [this.today],
      purchasePrice: [''],
      sellingPrice: [''],
      description: [''],
    });
    this.addProductItem();
    this.getProductData();

    this.getBankDetails();

    ////////////////////////////// New Product Add Form End ////////////////////
  }

  ////////////////////////////////////// Bank Start /////////////////

  async getBankDetails() {
    try {
      const response = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
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
  onBankChange(event: any) {
    this.selectedBankId = +event.target.value;
  }
  ////////////////////////////////////// Bank End /////////////////

  ///////////////////////////////////AddNewProduct Start///////////////////

  async openAddProductForm(event: any) {
    this.showAddProductForm = true;
    // await this.addNewProduct.controls['productsName'].patchValue(event);
    // Wait for modal and form to be rendered
    setTimeout(() => {
      this.addNewProduct.controls['productsName'].patchValue(event);

      // Optional: focus bhi karwa lo
      const input = document.querySelector(
        'input[formcontrolname="productsName"]'
      ) as HTMLInputElement;
      input?.focus();
    }, 50);
  }

  closeAddProductForm(): void {
    this.showAddProductForm = false;
  }

  async submitProduct() {
    // if (this.addNewProduct.invalid) {
    //   this.toastr.error('Please fill all required fields correctly.');
    //   return;
    // }

    const ProductData: IProduct = this.addNewProduct.value;
    try {
      const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
        'ProductApi/AddNewProduct',
        ProductData
      );

      if (res.isSuccess) {
        this.toastr.success('Data Saved Successfully');
        await this.getProductData();
        this.closeAddProductForm();
        this.addNewProduct.reset();
      } else {
        this.toastr.error(res?.message || 'Failed to save data');
      }
    } catch (error) {
      this.toastr.error('An error occurred while saving data');
      console.error(error);
    }
  }

  //////////////////////////////////////AddNewProduct End ///////////////////////////////////

  get purchaseDetails(): FormArray {
    return this.purchaseForm.get('purchaseDetails') as FormArray;
  }

  addProductItem() {
    const item = this.fb.group({
      id: [0],
      purchaseMasterId: [0],
      purchaseMasterName: [''],
      productId: ['', Validators.required],
      productName: [''],
      taxNumberId: [''],
      taxNumberName: [''],
      taxRate: [0],
      quantity: [1, Validators.required],
      purchasePrice: [0],
      productDiscount: [0],
      productDiscountAmount: [0],
      netAmount: [0],
      grossAmount: [0],
      taxAmount: [0],
      amount: [0],
      productDescription: [null],
      incTax: [false],
    });

    this.purchaseDetails.push(item);
  }

  removeProductItem(index: number) {
    this.purchaseDetails.removeAt(index);
    this.calculateSummary();
  }

  async getProductData() {
     
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'ProductApi/GetAllProduct'
    );

    if (res?.data) {
      const newProductList = res.data;

      const existingIds = this.products.map((p) => p.id);

      for (let newP of newProductList) {
        if (!existingIds.includes(newP.id)) {
          this.products.push(newP);
        }
      }

      this.productData = await this.products.map(
        (p) =>
          <ICommonValue>{
            id: p.id.toString(),
            name: p.productsName,
          }
      );
    }
  }

  async getTaxData() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'TaxApi/GetTaxData'
    );
    if (res.data) {
      this.taxs = res.data;
    }
  }

  onProductChange(index: number) {
    const itemGroup = this.purchaseDetails.at(index) as FormGroup;
    const productId = itemGroup.get('productId')?.value;
    const selectedProduct = this.products.find((p) => p.id == productId);

    if (selectedProduct) {
      itemGroup.patchValue({
        productName: selectedProduct.productsName,
        purchasePrice: selectedProduct.purchasePrice,
      });

      const tax = this.taxs.find((t) => t.taxId === selectedProduct.taxId);
      if (tax) {
        itemGroup.patchValue({
          taxNumberId: tax.taxId,
          taxNumberName: tax.taxName,
          taxRate: tax.taxRate,
        });
      }

      this.calculateItemAmount(itemGroup);
    }
  }

  calculateItemAmount(itemGroup: FormGroup) {
    const price = +itemGroup.get('purchasePrice')?.value || 0;
    const qty = +itemGroup.get('quantity')?.value || 1;
    const discount = +itemGroup.get('productDiscount')?.value || 0;
    const taxRate = +itemGroup.get('taxRate')?.value || 0;
    const isInclusive = itemGroup.get('incTax')?.value || false;

    const grossAmount = price * qty;
    const discountAmount = (grossAmount * discount) / 100;

    let netAmount: number;
    let taxAmount: number;
    let totalAmount: number;

    if (isInclusive) {
      netAmount = +((grossAmount - discountAmount) / (1 + taxRate / 100));
      taxAmount = +(grossAmount - discountAmount - netAmount);
      totalAmount = grossAmount - discountAmount;
    } else {
      netAmount = grossAmount - discountAmount;
      taxAmount = +((netAmount * taxRate) / 100);
      totalAmount = +(netAmount + taxAmount);
    }

    itemGroup.patchValue({
      productDiscountAmount: +discountAmount.toFixed(2),
      netAmount: +netAmount.toFixed(2),
      grossAmount: +grossAmount.toFixed(2),
      taxAmount: +taxAmount.toFixed(2),
      amount: +totalAmount.toFixed(2),
    });

    this.calculateSummary();
  }

  calculateSummary() {
    const details = this.purchaseDetails.controls;
    let totalTaxAmount = 0,
      totalProductDiscount = 0,
      totalAmount = 0;

    details.forEach((item: any) => {
      totalTaxAmount += +item.get('taxAmount')?.value || 0;
      totalProductDiscount += +item.get('productDiscountAmount')?.value || 0;
      totalAmount += +item.get('amount')?.value || 0;
    });

    const billDiscount = +this.purchaseForm.get('billDiscount')?.value || 0;
    const shippingAmount = +this.purchaseForm.get('shippingAmount')?.value || 0;

    const netAmount = totalAmount - billDiscount + shippingAmount;

    const payAmount = +this.purchaseForm.get('payAmount')?.value || 0;
    const balanceDue = netAmount - payAmount;
    const finalTotalDiscount = totalProductDiscount + billDiscount;

    this.purchaseForm.patchValue({
      totalTaxAmount,
      totalProductDiscount: finalTotalDiscount,
      totalAmount,
      netAmount,
      balanceDue,
      grandtotal: netAmount,
    });
  }

  onPayAmountChange() {
    const netAmount = +this.purchaseForm.get('netAmount')?.value || 0;
    const payAmount = +this.purchaseForm.get('payAmount')?.value || 0;
    const balanceDue = netAmount - payAmount;

    this.purchaseForm.patchValue({
      balanceDue,
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

  juned: any;

  // async submitForm() {
  //    
  //   if (this.purchaseForm.valid) {
  //     const payload: IPurchaseMaster = this.purchaseForm.value;
  //     (payload.purchaseDate = new Date()), (payload.modifyDate = new Date());
  //     this.juned = this.purchaseForm.value;

  //     payload.purchaseDetails = payload.purchaseDetails.map((item: any) => ({
  //       ...item,
  //       productId: +item.productId,
  //       taxNumberId: +item.taxNumberId,
  //     }));

  //     if (
  //       payload.payAmount > 0 &&
  //       (payload.bankId === 0 || payload.bankId === null)
  //     ) {
  //       this.toastr.error('Please select a payment Type');
  //       return;
  //     }
  //     if (payload.bankId > 0 && payload.payAmount === 0) {
  //       this.toastr.error('Please fill Amount');
  //     }

  //     console.log('Submitting:', payload);

  //     try {
  //       if (payload.id === 0) {
  //         const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
  //           'PurchaseMaster/AddNewPurchase',
  //           payload
  //         );

  //         if (res.isSuccess) {
  //           this.toastr.success('Data Saved Successfully');

  //           this.purchaseForm.reset();
  //           this.purchaseDetails.clear();
  //           this.router.navigate(['/purchase/printpurchaseinvoice'], {
  //             queryParams: { invoiceNo: payload.invoiceNo },
  //           });
  //         }
  //       } else {
  //         const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
  //           `PurchaseMaster/UpdatePurchaseMaster`,
  //           payload
  //         );
  //         if (res.isSuccess) {
  //           this.toastr.success('Data Update  Successfully');

  //           this.purchaseForm.reset();
  //           this.purchaseDetails.clear();
  //           this.router.navigate(['/purchase/printpurchaseinvoice'], {
  //             queryParams: { invoiceNo: payload.invoiceNo },
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       console.error('API Error:', error);
  //       this.toastr.error('Something went wrong while submitting');
  //     }
  //   } else {
  //     this.toastr.error('Please fill required fields');
  //   }
  //   this.purchaseForm = this.fb.group({
  //     invoiceNo: ['', Validators.required],
  //     supplierId: ['', Validators.required],
  //     suppliersName: [''],
  //     purchaseDate: ['', Validators.required],
  //     modifyDate: [''],
  //     purchaseInvoiceNumber: [''],
  //     totalTaxAmount: [0],
  //     totalProductDiscount: [0],
  //     billDiscount: [0],
  //     shippingAmount: [0],
  //     totalAmount: [0],
  //     netAmount: [0],
  //     payAmount: [0],
  //     balanceDue: [0],
  //     grandtotal: [0],
  //     status: ['Pending'],
  //     bankId: [0, Validators.required],
  //     purchaseDetails: this.fb.array([]),
  //   });

  //   this.addNewProduct = this.fb.group({
  //     productsName: ['', Validators.required],
  //     categoryId: ['', Validators.required],
  //     unitId: ['', Validators.required],
  //     brandId: ['', Validators.required],
  //     taxId: ['', Validators.required],
  //     productCode: [''],
  //     quantityAlert: [''],
  //     openStock: [''],
  //     currentDate: [this.today],
  //     purchasePrice: ['', Validators.required],
  //     sellingPrice: ['', Validators.required],
  //     description: [''],
  //   });
  // }

  async submitForm() {
     
    if (this.purchaseForm.invalid) {
      this.toastr.error('Please fill required fields');
      return;
    }

    const payload: IPurchaseMaster = this.purchaseForm.value;
    // payload.purchaseDate = new Date();
    payload.modifyDate = new Date();

    this.juned = this.purchaseForm.value;

    payload.purchaseDetails = payload.purchaseDetails.map((item: any) => ({
      ...item,
      productId: +item.productId,
      taxNumberId: +item.taxNumberId,
    }));

    if (
      payload.payAmount > 0 &&
      (payload.bankId === 0 || payload.bankId === null)
    ) {
      this.toastr.error('Please select a payment Type');
      return;
    }

    if (payload.bankId > 0 && payload.payAmount === 0) {
      this.toastr.error('Please fill Amount');
      return;
    }

    try {
       
      if (payload.id === 0) {
        const res = await this.genericSErvice.ExecuteAPI_Post<IResponse>(
          'PurchaseMaster/AddNewPurchase',
          payload
        );

        if (res.isSuccess) {
          this.toastr.success('Data Saved Successfully');

          this.purchaseForm.reset({
            invoiceNo: '',
            purchaseDate: new Date(),
            modifyDate: new Date(),
            status: 'Pending',
            bankId: 0,
          });

          this.purchaseDetails.clear();

          this.router.navigate(['/purchase/printpurchaseinvoice'], {
            queryParams: { invoiceNo: payload.invoiceNo },
          });
        }
      } else {
        const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
          `PurchaseMaster/UpdatePurchaseMaster`,
          payload
        );
        if (res.isSuccess) {
          this.toastr.success('Data Update Successfully');

          this.purchaseForm.reset({
            invoiceNo: '',
            purchaseDate: new Date(),
            modifyDate: new Date(),
            status: 'Pending',
            bankId: 0,
          });

          this.purchaseDetails.clear();

          this.router.navigate(['/purchase/printpurchaseinvoice'], {
            queryParams: { invoiceNo: payload.invoiceNo },
          });
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      this.toastr.error('Something went wrong while submitting');
    }
  }

  ///////////Edit Start /////////////////////////

  async editcategory(purchaseId: number) {
    if (this.purchaseForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const PurchaseData: IPurchaseMaster = this.purchaseForm.value;
    PurchaseData.id = purchaseId;

    const res = await this.genericSErvice.ExecuteAPI_Put<IPurchaseMaster>(
      'SupplierApi/UpdatePurchaseMaster',
      PurchaseData
    );

    if (res.isSuccess) {
      this.toastr.success('Purchase updated successfully');
      // this.cancel();
    } else {
      this.toastr.error(res?.message || 'Failed to update purchase');
    }
  }

  /////////////// Update Invoice ////////////////////////////////////////////
  async getPurchaseByInvoiceNo(invoiceNo: string) {
    await Promise.all([this.getProductData(), this.getBankDetails()]);
    this.genericSErvice
      .ExecuteAPI_Get<IResponse>(`PurchaseMaster/GetByInvoiceNo/${invoiceNo}`)
      .then((res) => {
        if (res.isSuccess) {
          this.purchase = res.data;

          this.patchPurchaseToForm(this.purchase);

          if (this.purchase.id && this.purchase.id > 0) {
            this.isUpdateDisabled = false;
            this.isSubmitDisabled = true;
          }
        }
      });
  }

  patchPurchaseToForm(purchase: IPurchaseMaster) {
    this.purchaseForm.patchValue({
      id: purchase.id,
      invoiceNo: purchase.invoiceNo,
      supplierId: purchase.supplierId,
      suppliersName: purchase.suppliersName,
      // purchaseDate: purchase.purchaseDate ,
      purchaseDate:  this.datepipe.transform(purchase.purchaseDate, 'dd MMM yyyy'),
      modifyDate: purchase.modifyDate,
      purchaseInvoiceNumber: purchase.purchaseInvoiceNumber,
      totalTaxAmount: purchase.totalTaxAmount,
      totalProductDiscount: purchase.totalProductDiscount,
      billDiscount: purchase.billDiscount,
      shippingAmount: purchase.shippingAmount,
      totalAmount: purchase.totalAmount,
      netAmount: purchase.netAmount,
      payAmount: purchase.payAmount,
      balanceDue: purchase.balanceDue,
      grandtotal: purchase.grandtotal,
      status: purchase.status,
      bankId: purchase.bankId ? purchase.bankId.toString() : null,
      billDescription: purchase.billDescription,
    });

    this.setPurchaseDetails(purchase.purchaseDetails);
  }

  setPurchaseDetails(details: IPurchaseDetail[]) {
    const array = this.purchaseForm.get('purchaseDetails') as FormArray;
    array.clear();

    details.forEach((d) => {
      const matchedTax = this.taxs.find((t) => t.taxId === d.taxNumberId);
      const taxRate = matchedTax ? matchedTax.taxRate : 0;

      array.push(
        this.fb.group({
          id: [d.id],
          purchaseMasterId: [d.purchaseMasterId],
          purchaseMasterName: [d.purchaseMasterName],
          productId: [d.productId ? d.productId.toString() : ''],
          productName: [d.productName],
          taxNumberId: [d.taxNumberId],
          taxNumberName: [d.taxNumberName],
          quantity: [d.quantity],
          purchasePrice: [d.purchasePrice],
          productDiscount: [d.productDiscount],
          productDiscountAmount: [d.productDiscountAmount],
          netAmount: [d.netAmount],
          grossAmount: [d.grossAmount],
          taxAmount: [d.taxAmount],
          amount: [d.amount],
          productDescription: [d.productDescription],
          taxRate: [taxRate],
          incTax: [d.incTax],
        })
      );
    });
  }

  /////////////////////// Call Recipt No ///////////

  async getNextInvoiceNo() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'PurchaseMaster/GetNextInvoiceNumber'
    );

    if (res) {
      this.purchaseForm.get('invoiceNo')?.setValue(res.invoiceNo);
    }
  }

  //////////////////////////// Page Invoice View /////////////////////////
  async GetPurchaseMasterById(id: number) {
    try {
      const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
        `PurchaseMaster/GetById?id=${id}`
      );

      if (res.isSuccess) {
        this.purchase = res.data;
        // this.purchaseForm.patchValue(res.data);
        this.PatchDataPurchaseForm(this.purchase);
        this.GetPurchaseDetailsToForm(res.data.purchaseDetails);
      } else {
        this.toastr.error(res.message || 'Data not found');
      }
    } catch (error) {
      console.error('API Error:', error);
      this.toastr.error('Something went wrong!');
    }
  }

  PatchDataPurchaseForm(purchase: IPurchaseMaster) {
    // this.purchaseForm.patchValue({ supplierId: Number(purchase.supplierId) });
    this.purchaseForm.patchValue({
      id: purchase.id,
      invoiceNo: purchase.invoiceNo,
      supplierId: purchase.supplierId,
      suppliersName: purchase.suppliersName,
      purchaseDate: purchase.purchaseDate,
      modifyDate: purchase.modifyDate,
      purchaseInvoiceNumber: purchase.purchaseInvoiceNumber,
      totalTaxAmount: purchase.totalTaxAmount,
      totalProductDiscount: purchase.totalProductDiscount,
      billDiscount: purchase.billDiscount,
      shippingAmount: purchase.shippingAmount,
      totalAmount: purchase.totalAmount,
      netAmount: purchase.netAmount,
      payAmount: purchase.payAmount,
      balanceDue: purchase.balanceDue,
      grandtotal: purchase.grandtotal,
      status: purchase.status,
      bankId: purchase.bankId ? purchase.bankId.toString() : '',
    });
  }

  GetPurchaseDetailsToForm(details: IPurchaseDetail[]) {
    const array = this.purchaseForm.get('purchaseDetails') as FormArray;
    array.clear();

    details.forEach((d) => {
      const matchedTax = this.taxs.find((t) => t.taxId === d.taxNumberId);
      const taxRate = matchedTax ? matchedTax.taxRate : 0;

      array.push(
        this.fb.group({
          id: [d.id],
          purchaseMasterId: [d.purchaseMasterId],
          purchaseMasterName: [d.purchaseMasterName],
          productId: [d.productId ? d.productId.toString() : ''],
          productName: [d.productName],
          taxNumberId: [d.taxNumberId],
          taxNumberName: [d.taxNumberName],
          quantity: [d.quantity],
          purchasePrice: [d.purchasePrice],
          productDiscount: [d.productDiscount],
          productDiscountAmount: [d.productDiscountAmount],
          netAmount: [d.netAmount],
          grossAmount: [d.grossAmount],
          taxAmount: [d.taxAmount],
          amount: [d.amount],
          taxRate: [taxRate],
          incTax: [d.incTax],
        })
      );
    });
  }

  //////////// tax change on select product ////////
  showEditTaxForm = false;
  editTaxForm: FormGroup;

  selectedProductIndexForTaxEdit: number | null = null;

  openEditTaxForm(index: number) {
    try {
      this.selectedProductIndexForTaxEdit = index;
      this.showEditTaxForm = true;

      const itemGroup = this.purchaseDetails.at(index) as FormGroup;
      const currentTaxId = itemGroup.get('taxNumberId')?.value;

      this.editTaxForm.patchValue({
        taxId: currentTaxId,
      });
    } catch (error) {
      console.error('Error in openEditTaxForm:', error);
    }
  }

  applySelectedTax() {
    if (
      this.editTaxForm.invalid ||
      this.selectedProductIndexForTaxEdit == null
    ) {
      this.toastr.error('Please select a GST');
      return;
    }

    const selectedTaxId = this.editTaxForm.value.taxId;
    const selectedTax = this.taxs.find((t) => t.taxId === +selectedTaxId);

    if (!selectedTax) {
      this.toastr.error('Invalid GST selection');
      return;
    }

    const itemGroup = this.purchaseDetails.at(
      this.selectedProductIndexForTaxEdit
    ) as FormGroup;

    itemGroup.patchValue({
      taxNumberId: selectedTax.taxId,
      taxNumberName: selectedTax.taxName,
      taxRate: selectedTax.taxRate,
    });

    this.calculateItemAmount(itemGroup);
    this.toastr.success('GST Updated');

    this.closeEditTaxForm();
  }

  closeEditTaxForm() {
    this.showEditTaxForm = false;
    this.selectedProductIndexForTaxEdit = -1;
    this.editTaxForm.reset();
  }

  /////// test ////////////////////
  countryid: any;
  currencyname: string = '';

  async loadCompanyProfile() {
     
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.regionId;

      this.getCountryById(this.countryid);
    }
  }

  async getCountryById(id: number) {
    let response = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      `Core/GetCountryById/${id}`
    );

    if (response.isSuccess) {
      this.currencyname = response.data.currency;
      console.log(this.currencyname);
    }
  }
}
