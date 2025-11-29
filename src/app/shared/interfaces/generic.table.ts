export interface Column<T> {
  name: keyof T;
  header: string;
  // Add here any additional action or information
  // about a generic table column, like whether it is
  // sortable or not.
  sortable?: boolean;
}

export interface Row<T> {
  values: T;
  // Add here any additional action or information
  // about a generic table row, like a navigation
  // target if the row is clicked.
}

export interface Car {
  manufacturer: string;
  model: string;
  powerSupply: 'petrol' | 'diesel' | 'electricity';
}

