declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

type PaginationType = {
  offset: number,
  numberPerPage: number,
  pageCount: number,
  currentData: ProductsType
}

type PageClickType = {
  selected: number
}

type ProductType = {
  color: string,
  id: string,
  manufacturer: string,
  name: string,
  price: number,
  type: string,
  availability: string
}

type ProductsType = Array<ProductType>;

type ProductsAPIType = {
  [key: string]: Array<ProductType>;
}

type ProductStatusType = {
  pendingProduct: boolean,
  successProduct: boolean
}
