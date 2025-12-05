import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { IBankDetails } from 'src/app/interfaces/accounting/bankdetails';
import { IInvoiceSetting } from 'src/app/interfaces/configuration/invoicesetting';
import { ITax } from 'src/app/interfaces/configuration/tax';
import { ICommonValue } from 'src/app/interfaces/dashboard/common';
import { IProduct } from 'src/app/interfaces/inventory/product';
import { IResponse } from 'src/app/interfaces/response';
import { ISaleMaster, ISalesDetail } from 'src/app/interfaces/sales/saleMaster';
import { ChangeDatePipe } from 'src/app/pipes/change-date.pipe';
import { GenericService } from 'src/app/services/generic.service.service';
import { IJWTTokan } from 'src/app/shared/interfaces/jwt.tokan';
import { TranslatePipe } from 'src/app/translate/translate.pipe';

@Component({
  selector: 'app-salemaster',
  templateUrl: './salemaster.component.html',
  styleUrl: './salemaster.component.css',
})
export class SalemasterComponent {
  saleForm!: FormGroup;
  products: IProduct[] = [];
  customes: any[] = [];
  taxs: ITax[] = [];
  bankList: IBankDetails[] = [];
  selectedUser:string;
  userDisabled:boolean = false;
  selectedBankId!: number;
  isUpdateDisabled: boolean = true;
  isSubmitDisabled: boolean = false;
  saleData: any;
  productData: ICommonValue[];
  bankData: ICommonValue[];
  

  //  Invoice Setting//
  invoicesettings: IInvoiceSetting[] = [];
  invoicesetting: IInvoiceSetting;

  sales: ISaleMaster[] = [];
  sale: ISaleMaster;

  saledetails: ISalesDetail[] = [];
  addNewProduct: FormGroup;
  today: Date = new Date();
   
  showAddProductForm = false; //AddProduct

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

      const token = localStorage.getItem('smart_token');
    const decoded = jwtDecode<IJWTTokan>(token);
    this.selectedUser = decoded.nameid;
    if(decoded.nameid != "2") {
   
this.userDisabled = true;
    }
    
    
   console.log(this.userDisabled);
     
    this.getNextInvoiceNo();
    this.GetCustomerDroupdown();
    this.loadCompanyProfile();
    this.saleForm = this.fb.group({
      id: [0],
      invoiceNo: ['', Validators.required],
      customerId: ['', Validators.required],
      userId:[null, Validators.required],
      customerName: [''],
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
      bankId: [null, Validators.required],
      billDescription: [null],
      salesById:[null, Validators.required],
      saleDetails: this.fb.array([]),
    });

    //////// Tax form on product select /////
    this.editTaxForm = this.fb.group({
      taxId: [null, Validators.required],
    });
    /////////////

    this.getTaxData();

    /////////////// use for navigate on purchase Invoice View Page /////////////////////
     
    // const navigation = this.router.getCurrentNavigation();

    // this.saleData = history.state.data;
    // alert(this.saleData);

    // if (this.saleData) {
    //    
    //   this.saleForm.patchValue(this.saleData);

    //   this.GetPurchaseMasterById(this.saleData.id);
    //   this.isUpdateDisabled = false;
    //   this.isSubmitDisabled = true;
    // }
    // this.route.queryParams.subscribe((params) => {
    //   const invoiceNo = params['invoiceNo'];
    //   if (invoiceNo) {
    //     this.getPurchaseByInvoiceNo(invoiceNo);
    //   } else {
    //     console.warn('invoiceNo not found');
    //   }
    // });

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

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  addProductItem() {
    const item = this.fb.group({
      id: [0],
      saleMasterId: [0],
      saleMasterName: [''],
      productId: ['', Validators.required],
      productName: [''],
      taxNumberId: [''],
      taxNumber: [''],
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

    this.saleDetails.push(item);
  }

  removeProductItem(index: number) {
    this.saleDetails.removeAt(index);
    this.calculateSummary();
  }

  async getProductData() {
    const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'ProductApi/GetAllProduct'
    );

    if (res.isSuccess) {
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

  onProductChange(index: number, productId: number) {
    const itemGroup = this.saleDetails.at(index) as FormGroup;

    const selectedProduct = this.products.find((p) => p.id === +productId);

    console.log('Selected Product ID:', productId);

    if (selectedProduct) {
      itemGroup.patchValue({
        productName: selectedProduct.productsName,
        purchasePrice: selectedProduct.sellingPrice,
      });

      const tax = this.taxs.find((t) => t.taxId === selectedProduct.taxId);
      if (tax) {
        itemGroup.patchValue({
          taxNumberId: tax.taxId,
          taxNumber: tax.taxName,
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
    const details = this.saleDetails.controls;
    let totalTaxAmount = 0,
      totalProductDiscount = 0,
      totalAmount = 0;

    details.forEach((item: any) => {
      totalTaxAmount += +item.get('taxAmount')?.value || 0;
      totalProductDiscount += +item.get('productDiscountAmount')?.value || 0;
      totalAmount += +item.get('amount')?.value || 0;
    });

    const billDiscount = +this.saleForm.get('billDiscount')?.value || 0;
    const shippingAmount = +this.saleForm.get('shippingAmount')?.value || 0;

    const netAmount = totalAmount - billDiscount + shippingAmount;

    const payAmount = +this.saleForm.get('payAmount')?.value || 0;
    const balanceDue = netAmount - payAmount;
    const finalTotalDiscount = totalProductDiscount + billDiscount;

    this.saleForm.patchValue({
      totalTaxAmount,
      totalProductDiscount: finalTotalDiscount,
      totalAmount,
      netAmount,
      balanceDue,
      grandtotal: netAmount,
    });
  }

  onPayAmountChange() {
    const netAmount = +this.saleForm.get('netAmount')?.value || 0;
    const payAmount = +this.saleForm.get('payAmount')?.value || 0;
    const balanceDue = netAmount - payAmount;

    this.saleForm.patchValue({
      balanceDue,
    });
  }

  juned: any;

  // async submitForm() {
  //    
  //   if (this.purchaseForm.valid) {
  //     const payload: IPurchaseMaster = this.purchaseForm.value;
  //     (payload.purchaseDate = new Date()), (payload.modifyDate = new Date());
  //     this.juned = this.purchaseForm.value;

  //     payload.saleDetails = payload.saleDetails.map((item: any) => ({
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
  //           this.saleDetails.clear();
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
  //           this.saleDetails.clear();
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
  //     saleDetails: this.fb.array([]),
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
     
    if (this.saleForm.invalid) {
      this.toastr.error('Please fill required fields');
      return;
    }
let changeDate = new ChangeDatePipe(this.datepipe) ;
    let payload: ISaleMaster = this.saleForm.value;
    payload.purchaseDate = changeDate.transform(payload.purchaseDate);
    console.log(payload.purchaseDate);
    // payload.purchaseDate = new Date();
    payload.modifyDate = new Date();

    this.juned = this.saleForm.value;

    payload.saleDetails = payload.saleDetails.map((item: any) => ({
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
          'SaleMasterApi/AddNewSales',
          payload
        );

        if (res.isSuccess) {
          this.toastr.success('Data Saved Successfully');

          this.saleForm.reset({
            invoiceNo: '',
            purchaseDate: new Date(),
            modifyDate: new Date(),
            status: 'Pending',
            bankId: 0,
          });

          this.saleDetails.clear();
          this.getNextInvoiceNo();
          this.addProductItem();
          this.getProductData();

          this.getBankDetails();

          this.router.navigate(['/sales/printsaleinvoice'], {
            queryParams: { invoiceNo: payload.invoiceNo },
          });
        }
      } else {
        const res = await this.genericSErvice.ExecuteAPI_Put<IResponse>(
          `SaleMasterApi/UpdateSales`,
          payload
        );
        if (res.isSuccess) {
          this.toastr.success('Data Update Successfully');

          this.saleForm.reset({
            invoiceNo: '',
            purchaseDate: new Date(),
            modifyDate: new Date(),
            status: 'Pending',
            bankId: 0,
          });

          this.saleDetails.clear();
  this.router.navigate(['/sales/saleinvoiceview'], {
            queryParams: { invoiceNo: payload.invoiceNo },
          });
          // this.router.navigate(['/sales/printsaleinvoice'], {
          //   queryParams: { invoiceNo: payload.invoiceNo },
          // });
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      this.toastr.error('Something went wrong while submitting');
    }
  }

  ///////////Edit Start /////////////////////////

  async editcategory(purchaseId: number) {
    if (this.saleForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const PurchaseData: ISaleMaster = this.saleForm.value;
    PurchaseData.id = purchaseId;

    const res = await this.genericSErvice.ExecuteAPI_Put<ISaleMaster>(
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
      .ExecuteAPI_Get<IResponse>(`SaleMasterApi/GetByInvoiceNo/${invoiceNo}`)
      .then((res) => {
        if (res.isSuccess) {
          this.sale = res.data;

          this.patchPurchaseToForm(this.sale);

          if (this.sale.id && this.sale.id > 0) {
            this.isUpdateDisabled = false;
            this.isSubmitDisabled = true;
          }
        }
      });
  }

  patchPurchaseToForm(sale: ISaleMaster) {
    this.saleForm.patchValue({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      userId:sale.userId,
      customerId: sale.customerId,
      customerName: sale.customerName,
      purchaseDate: sale.purchaseDate ? this.datepipe.transform(sale.purchaseDate , 'dd MMM yyyy') :null,
      modifyDate: sale.modifyDate,
      purchaseInvoiceNumber: sale.purchaseInvoiceNumber,
      totalTaxAmount: sale.totalTaxAmount,
      totalProductDiscount: sale.totalProductDiscount,
      billDiscount: sale.billDiscount,
      shippingAmount: sale.shippingAmount,
      totalAmount: sale.totalAmount,
      netAmount: sale.netAmount,
      payAmount: sale.payAmount,
      balanceDue: sale.balanceDue,
      salesById:sale.salesById,
      grandtotal: sale.grandtotal,
      status: sale.status,
      bankId: sale.bankId ? sale.bankId.toString() : '',
      billDescription: sale.billDescription,
    });
    if(sale.userId) {
  this.selectedUser = sale.userId.toString();
    }
     
  

    this.setPurchaseDetails(sale.saleDetails);
  }

  setPurchaseDetails(details: ISalesDetail[]) {
    const array = this.saleForm.get('saleDetails') as FormArray;
    array.clear();

    details.forEach((d) => {
      const matchedTax = this.taxs.find((t) => t.taxId === d.taxNumberId);
      const taxRate = matchedTax ? matchedTax.taxRate : 0;

      array.push(
        this.fb.group({
          id: [d.id],
          saleMasterId: [d.saleMasterId],
          
          saleMasterName: [d.saleMasterName],
          productId: [d.productId ? d.productId.toString() : ''],
          productName: [d.productName],
          taxNumberId: [d.taxNumberId],
          taxNumber: [d.taxNumber],
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
      'SaleMasterApi/GetNextInvoiceNumber'
    );

    if (res) {
      await this.saleForm.get('invoiceNo')?.setValue(res.invoiceNo);
    }
  }

  //////////////////////////// Page Invoice View /////////////////////////
  async GetPurchaseMasterById(id: number) {
     
    try {
      const res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
        `SaleMasterApi/GetById?id=${id}`
      );

      if (res.isSuccess) {
        this.sale = res.data;
        // this.purchaseForm.patchValue(res.data);
        this.PatchDataPurchaseForm(this.sale);
        this.GetPurchaseDetailsToForm(res.data.saleDetails);
      } else {
        this.toastr.error(res.message || 'Data not found');
      }
    } catch (error) {
      console.error('API Error:', error);
      this.toastr.error('Something went wrong!');
    }
  }

  PatchDataPurchaseForm(sale: ISaleMaster) {
    // this.purchaseForm.patchValue({ supplierId: Number(purchase.supplierId) });
    this.saleForm.patchValue({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      userId:sale.userId,
      customerId: sale.customerId,
      customerName: sale.customerName,
      purchaseDate: sale.purchaseDate,
      modifyDate: sale.modifyDate,
      purchaseInvoiceNumber: sale.purchaseInvoiceNumber,
      totalTaxAmount: sale.totalTaxAmount,
      totalProductDiscount: sale.totalProductDiscount,
      billDiscount: sale.billDiscount,
      shippingAmount: sale.shippingAmount,
      totalAmount: sale.totalAmount,
      netAmount: sale.netAmount,
      payAmount: sale.payAmount,
      balanceDue: sale.balanceDue,
       salesById:sale.salesById,
      grandtotal: sale.grandtotal,
      status: sale.status,
      bankId: sale.bankId ? sale.bankId.toString() : '',
    });
  }

  GetPurchaseDetailsToForm(details: ISalesDetail[]) {
    const array = this.saleForm.get('saleDetails') as FormArray;
    array.clear();

    details.forEach((d) => {
      const matchedTax = this.taxs.find((t) => t.taxId === d.taxNumberId);
      const taxRate = matchedTax ? matchedTax.taxRate : 0;

      array.push(
        this.fb.group({
          id: [d.id],
          saleMasterId: [d.saleMasterId],
          saleMasterName: [d.saleMasterName],
          productId: [d.productId ? d.productId.toString() : ''],
          productName: [d.productName],
          taxNumberId: [d.taxNumberId],
          taxNumber: [d.taxNumber],
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

      const itemGroup = this.saleDetails.at(index) as FormGroup;
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

    const itemGroup = this.saleDetails.at(
      this.selectedProductIndexForTaxEdit
    ) as FormGroup;

    itemGroup.patchValue({
      taxNumberId: selectedTax.taxId,
      taxNumber: selectedTax.taxName,
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

  ////// Customer DroupDown  Start ////////////
  customerdata: any[] = [];
  async GetCustomerDroupdown() {
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'CustomerApi/GetCustomerDropdown'
    );
    if (res.isSuccess) {
      this.customerdata = res.data;
    }
  }

  ////// Customer DroupDown  End ////////////

  countryid: any;
  currencyname: string = '';

  async loadCompanyProfile() {
     
    let res = await this.genericSErvice.ExecuteAPI_Get<IResponse>(
      'Core/GetCompanyProfile'
    );

    if (res) {
      this.countryid = res.countryId;

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
