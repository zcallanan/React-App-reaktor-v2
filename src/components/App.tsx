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

interface Props {
  slug: string
}

interface State {
  pending: pendingType,
  success: successType,
  failure: failureType
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
      }
    }
  }

  componentDidMount() {
    const product: string = this.props.slug // Product name from router slug

    // TODO: Get product list
    this.getProductList(product);

  }

  protected getProductList(product: string): void {


    const headers: HeadersInit = {
      'Target-URL': `https://bad-api-assignment.reaktor.com/v2/products/${product}`
    }

    const opts: RequestInit = {
      headers
    }

    const url: string = `http://localhost:3010/` // TODO: Replace with production value
    // const url: string = `https://bad-api-assignment.reaktor.com/v2/products/${product}`
    const pending: pendingType = { ...this.state.pending };
    const success: successType = { ...this.state.success };
    pending.pendingProduct = true;
    this.setState({ pending });
    // fetch product data
    fetch(url, opts)
    .then(response => response.text())
    .then(text => {
      try {
          const data = JSON.parse(text);
          if (data.length) {
            console.log('success!')
            pending.pendingProduct = false;
            success.successProduct = true;
            this.setState({ pending, success });
            // TODO: Make the Availabilty request
          } else {
            // TODO: Data is empty, handle it
          }

      } catch(err) {
         // TODO: Handle text response
      }
    });
  }

  protected getAvailabilities() {

  }

  /*
    TODOs:
    1. API calls on page load, or on nav click
    2. API product
  */

  render() {

    return (
      <div>Hello Placeholder!</div>
    )
  }

}

export default App;
