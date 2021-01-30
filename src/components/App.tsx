import React from 'react';

// State types

type pendingProductType = {
  pendingProduct: boolean,
}

type successProductType = {
  successProduct: boolean,
}

type failureProductType = {
  failureProduct: boolean,
}

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

// Availabilities

type availabilityAPIType = {
  id: string,
  datapayload: string
}

type availabilitiesAPIType = Array<availabilityAPIType>;

/*

  availabilities: [
    manName: {
      pendingAvailability: boolean,
      successAvailability: boolean,
      failureAvailability: boolean
    }
  ]

*/

type availabilitiesType = Array<manufacturerType>;

// type manufacturersAvailabiltiesType = {
//   availabilities: manufacturerType
// }

type manufacturerType = {
  [key: string]: manufacturerAvailabilityType
}

type manufacturerAvailabilityType = {
  pendingAvailability: boolean,
  successAvailability: boolean,
  failureAvailability: boolean
}

interface Props {
  slug: string
}

interface State {
  pending: pendingProductType,
  success: successProductType,
  failure: failureProductType,
  products: productsType,
  manufacturers: manufacturersType,
  availabilities: availabilitiesType
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      pending: {
        pendingProduct: false,
      },
      success: {
        successProduct: false,
      },
      failure: {
        failureProduct: false,
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
    const pending: pendingProductType = { ...this.state.pending };
    const success: successProductType = { ...this.state.success };


    pending.pendingProduct = true;
    this.setState({ pending });

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

        if (await data.length) {
          pending.pendingProduct = false;
          success.successProduct = true;
          this.setState({ pending, success, });
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
            //this.getAvailabilities(manufacturer);
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

  // protected getAvailabilities(manufacturer: string): void {
  //   const availabilityURL: string = process.env.REACT_APP_AVAILABILITY_URL!
  //   const webToken: string = process.env.REACT_APP_WEB_TOKEN!

  //   const headers: HeadersInit = {
  //     'Target-URL': `${availabilityURL}${manufacturer}`,
  //     'Web-Token': webToken
  //   }

  //   const opts: RequestInit = {
  //     headers
  //   }
  //   const url: string = process.env.REACT_APP_PROXY_URL! // TODO: Replace with production value

  //   const fetchAvailabilities = async (url: string, opts: RequestInit): Promise<availabilitiesAPIType | undefined> => {
  //     let data: availabilitiesAPIType;
  //     try {

  //        const response = await fetch(url, opts)
  //        data = await response.json()


  //       if (await data.length) {
  //         pending.pendingProduct = false;
  //         success.successProduct = true;
  //         this.setState({ pending, success, });
  //         let manufacturers: manufacturersType;
  //         data.forEach(item => {
  //           manufacturers = [...this.state.manufacturers]
  //           // Track availability per product
  //           item['availability'] = "";
  //           if (!manufacturers.includes(item.manufacturer)) {
  //             this.setState({
  //               manufacturers: [...this.state.manufacturers, item.manufacturer],
  //               products: [...this.state.products, item]
  //             })
  //           } else {
  //             this.setState({
  //               products: [...this.state.products, item]
  //             })
  //           }
  //         })
  //         // Save data to session storage if that product does not have one
  //         if (!productsRef) {
  //           sessionStorage.setItem(`${product}`, JSON.stringify(data));
  //         }
  //         manufacturers = [...this.state.manufacturers]
  //         manufacturers.forEach(manufacturer => {

  //         })

  //       } else {
  //         // TODO: Data is empty, handle it
  //       }
  //     } catch(err) {
  //        // TODO: Handle text response
  //        return err
  //     }
  //   }
  // }

  render() {
    const pending: pendingProductType = { ...this.state.pending };
    const success: successProductType = { ...this.state.success };
    const failure: failureProductType = { ...this.state.failure };

    if (pending.pendingProduct && !success.successProduct) {
      // Product List API return is pending, render product list loadspinner
    } else if (!pending.pendingProduct && success.successProduct) {
      // Render product list data
    } else  if (failure.failureProduct) {
      // Handle if no products to display
    }

    return (
      <div>Hello Placeholder!</div>
    )
  }

}

export default App;
