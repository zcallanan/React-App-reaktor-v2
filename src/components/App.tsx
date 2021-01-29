import React from 'react';

type pendingType = {
  pendingProduct: boolean,
  pendingAvailability: boolean
}

type successType = {
  successProduct: boolean,
  successAvailability: boolean
}

type failureType = {
  failureProduct: boolean,
  failureAvailability: boolean
}

type productType = {
  color: Array<string>,
  id: string,
  manufacturer: string,
  name: string,
  price: number,
  type: string,
}

type productsType = Array<productType>;

type manufacturersType = Array<string>;

interface Props {
  slug: string
}

interface State {
  pending: pendingType,
  success: successType,
  failure: failureType,
  products: productsType,
  manufacturers: manufacturersType
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      pending: {
        pendingProduct: false,
        pendingAvailability: false
      },
      success: {
        successProduct: false,
        successAvailability: false
      },
      failure: {
        failureProduct: false,
        failureAvailability: false
      },
      products: [],
      manufacturers: []
    }
  }

  componentDidMount() {
    const product: string = this.props.slug // Product name from router slug

    // TODO: Get product list
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
    const pending: pendingType = { ...this.state.pending };
    const success: successType = { ...this.state.success };


    pending.pendingProduct = true;
    this.setState({ pending });

    const getProducts = async (url: string, opts: RequestInit): Promise<Array<productType> | undefined> => {
      let data: productsType;
      try {
        // Check sessionStorage
        const productsRef: string | null = sessionStorage.getItem(`${product}`)

        if (productsRef) {
          // sessionStorage available
          data = JSON.parse(productsRef);
        } else {
          // Get data from products API
          const response = await fetch(url, opts)
          data = await response.json()
        }

        if (await data.length) {
          pending.pendingProduct = false;
          success.successProduct = true;
          this.setState({ pending, success, });
          let manufacturers: manufacturersType;
          console.log(data)
          data.forEach(item => {
            manufacturers = [...this.state.manufacturers]
            if (!manufacturers.includes(item.manufacturer)) {
              this.setState({ manufacturers: [...this.state.manufacturers, item.manufacturer], products: [...this.state.products, item] })
            } else {
              this.setState({ products: [...this.state.products, item] })
            }
          })
          // Save data to session storage
          if (!productsRef) {
            sessionStorage.setItem(`${product}`, JSON.stringify(data));
          }
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
      getProducts(url, opts);
    }


  }

  protected getAvailabilities() {
    /* When product list data is available:
      1. Availability is determined by manufacturer, so parse data for a list of manufacturers
      2. Issue API request per manufacturer, handling pending, success, failure for each in list


    */

  }

  render() {
    const pending: pendingType = { ...this.state.pending };
    const success: successType = { ...this.state.success };
    const failure: failureType = { ...this.state.failure };

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
