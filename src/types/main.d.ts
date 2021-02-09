declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

type paginationType = {
  offset: number,
  numberPerPage: number,
  pageCount: number,
  currentData: productsType
}

type pageClickType = {
  selected: number
}

type productType = {
  color: string,
  id: string,
  manufacturer: string,
  name: string,
  price: number,
  type: string,
  availability: string
}

type productsType = Array<productType>;

type productsAPIType = {
  rows: Array<productType>;
}

type productStatusType = {
  pendingProduct: boolean,
  successProduct: boolean
}
