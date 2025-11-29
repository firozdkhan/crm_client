export interface IProduct {
  id: number;
  productsName: string;
  productCode: number;
  categoryId: number;
  categoryName: string;
  unitId: number;
  unitName: string;
  brandId: number;
  brandName: string;
  quantityAlert: number;
  openStock: number;
  currentDate: string;
  purchasePrice: number;
  sellingPrice: number;
  taxId: number;
  taxName: string;
  description: string;
  hsnCode: string;
}
