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
  color: Array<string>,
  id: string,
  manufacturer: string,
  name: string,
  price: number,
  type: string,
  availability: string
}

type productsType = Array<productType>;

type manufacturersType = Array<string>;

type availabilityAPIType = {
  id: string,
  DATAPAYLOAD: string
}

type availabilityAPIStatus = {
  code: number,
  response: availabilitiesAPIType
}

type availabilitiesAPIType = Array<availabilityAPIType>;

type availabilitiesType = Array<manufacturerType>;

type rawType = Array<manufacturerRawType>;

type manufacturerRawType = {
  [key: string]: availabilityRawType
}

type availabilityRawType = {
  availabilityRaw: availabilitiesAPIType,
  parsed: boolean,
}

type manufacturerType = {
  [key: string]: manufacturerAvailabilityType
}

type manufacturerAvailabilityType = {
  pendingAvailability: boolean,
  successAvailability: boolean,
  failureAvailability: boolean
}

type productStatusType = {
  pendingProduct: boolean,
  successProduct: boolean,
  failureProduct: boolean
}
