import React from 'react';

type manufacturersType = Array<string>;

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

type availabilityAPIType = {
  id: string,
  datapayload: string
}

type availabilityAPIStatus = {
  code: number,
  response: availabilitiesAPIType
}

type availabilitiesAPIType = Array<availabilityAPIType>;

type availabilitiesType = Array<manufacturerType>;

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

interface Props {
  slug: string
}

interface State {
  productStatus: productStatusType,
  products: productsType,
  manufacturers: manufacturersType,
  availabilities: availabilitiesType
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      productStatus: {
        pendingProduct: false,
        successProduct: false,
        failureProduct: false
      },
      products: [],
      manufacturers: [],
      availabilities: []
    }
  }

  componentDidMount() {
    const product: string = this.props.slug // Product name from router slug

    // Populate products and manufacturers state & sessionStorage
    this.getProductList(product);

  }

  protected getProductList(product: string): void {
    const productURL: string = process.env.REACT_APP_PRODUCT_URL!
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!

    const headers: HeadersInit = {
      'Target-URL': `${productURL}${product}`,
      'Web-Token': webToken
    }

    const opts: RequestInit = {
      headers
    }
    const url: string = process.env.REACT_APP_PROXY_URL! // TODO: Replace with production value
    const productStatus: productStatusType = { ...this.state.productStatus };

    productStatus.pendingProduct = true;
    this.setState({ productStatus });

    const fetchProducts = async (url: string, opts: RequestInit): Promise<productsType | undefined> => {
      let data: productsType;
      try {
        // Check sessionStorage
        const productsRef: string | null = sessionStorage.getItem(`${product}`)

        if (productsRef) {
          // sessionStorage is available
          data = JSON.parse(productsRef);
          // TODO: get API data and refresh stale data
        } else {
          // sessionStorage is not available, get data from products API
          const response = await fetch(url, opts)
          data = await response.json()
        }

        if (await Array.isArray(data) && data.length) {
          const productStatus: productStatusType = { ...this.state.productStatus };

          productStatus.pendingProduct = false;
          productStatus.successProduct = true;
          this.setState({ productStatus });
          let manufacturers: manufacturersType; // Array of manufacturer strings
          // let availabilities: availabilitiesType;  // Array of manufacturer objects
          data.forEach(item => {
            manufacturers = [...this.state.manufacturers]
            // Track availability per product
            item['availability'] = "";
            if (!manufacturers.includes(item.manufacturer)) {
              this.setState({
                manufacturers: [...this.state.manufacturers, item.manufacturer],
                products: [...this.state.products, item]
              })
            } else {
              this.setState({
                products: [...this.state.products, item]
              })
            }
          })
          // Save data to session storage if that product does not have one
          if (!productsRef) {
            sessionStorage.setItem(`${product}`, JSON.stringify(data));
          }

          manufacturers = [...this.state.manufacturers]
          let availability: manufacturerType;
          manufacturers.forEach(manufacturer => {
            // availabilities = {...this.state.availabilities}
            availability = {[manufacturer]: {
              pendingAvailability: false,
              successAvailability: false,
              failureAvailability: false
            }}
            this.setState({
              availabilities: [...this.state.availabilities, availability]
            })
            this.getAvailabilities(manufacturer);
          })

        } else {
          // TODO: Data is empty, handle it
        }
      } catch(err) {
         // TODO: Handle text response
         return err
      }
    }

    const products: productsType = { ...this.state.products }
    if (!products.length) {
      fetchProducts(url, opts);
    }


  }

  protected getAvailabilities(manufacturer: string): void {

    const availabilityURL: string = process.env.REACT_APP_AVAILABILITY_URL!
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!

    const headers: HeadersInit = {
      'Target-URL': `${availabilityURL}${manufacturer}`,
      'Web-Token': webToken
    }

    const opts: RequestInit = {
      headers
    }
    const url: string = process.env.REACT_APP_PROXY_URL! // TODO: Replace with production value

    const availabilities: availabilitiesType = [ ...this.state.availabilities ];
    const manufacturers: manufacturersType = [...this.state.manufacturers];

    availabilities[manufacturers.indexOf(manufacturer)][manufacturer].pendingAvailability = true;

    this.setState({ availabilities });

    const fetchAvailabilities = async (url: string, opts: RequestInit): Promise<availabilityAPIStatus | undefined> => {
      let data: availabilityAPIStatus;
      try {

         // Check sessionStorage
            const manufacturerRef: string | null = sessionStorage.getItem(`${manufacturer}`)

            if (manufacturerRef) {
              // sessionStorage is available
              data = JSON.parse(manufacturerRef);
              // TODO: get API data and refresh stale data
            } else {
              // sessionStorage is not available, get data from products API
              let response = await fetch(url, opts)
              data = await response.json()
              console.log(await data.response)
            }

        if (await Array.isArray(data.response) && data.response.length) {
          const availabilities: availabilitiesType = [ ...this.state.availabilities ]
          const manufacturers: manufacturersType = [...this.state.manufacturers];

          availabilities[manufacturers.indexOf(manufacturer)][manufacturer].pendingAvailability = false;
          availabilities[manufacturers.indexOf(manufacturer)][manufacturer].successAvailability = true;
          this.setState({ availabilities });

          // console.log(data)
          // data.forEach(item => {
          //   manufacturers = [...this.state.manufacturers]
          //   // Track availability per product
          //   item['availability'] = "";
          //   if (!manufacturers.includes(item.manufacturer)) {
          //     this.setState({
          //       manufacturers: [...this.state.manufacturers, item.manufacturer],
          //       products: [...this.state.products, item]
          //     })
          //   } else {
          //     this.setState({
          //       products: [...this.state.products, item]
          //     })
          //   }
          // })
          // // Save data to session storage if that product does not have one
          // if (!productsRef) {
          //   sessionStorage.setItem(`${product}`, JSON.stringify(data));
          // }
          // manufacturers = [...this.state.manufacturers]
          // manufacturers.forEach(manufacturer => {

          // })

        } else {
          // TODO: Data is empty, handle it
          fetchAvailabilities(url, opts);
        }
      } catch(err) {
         // TODO: Handle text response
         return err
      }
    }
    fetchAvailabilities(url, opts);
  }

  render() {
    const productStatus: productStatusType = { ...this.state.productStatus }

    if (productStatus.pendingProduct && !productStatus.successProduct) {
      // Product List API return is pending, render product list loadspinner
    } else if (!productStatus.pendingProduct && productStatus.successProduct) {
      // Render product list data
    } else  if (productStatus.failureProduct) {
      // Handle if no products to display
    }

    return (
      <div>Hello Placeholder!</div>
    )
  }

}

export default App;
