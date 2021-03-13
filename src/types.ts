export type PageClickType = {
  selected: number;
};

export type ProductType = {
  color: string;
  id: string;
  manufacturer: string;
  name: string;
  price: number;
  type: string;
  availability: string;
};

export type ProductsAPIType = {
  [key: string]: ProductType[];
};
