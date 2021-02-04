import React from 'react';
import ProductList from './ProductList';
import Spinner from 'react-bootstrap/Spinner';
import ReactPaginate from 'react-paginate';

interface Props {
  slug: string
}

interface State {
  controller: AbortController,
  productStatus: productStatusType,
  products: productsType,
  manufacturers: manufacturersType,
  availabilities: availabilitiesType,
  availabilityData: rawType,
  pagination: paginationType,
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      controller: new AbortController(),
      productStatus: {
        pendingProduct: false,
        successProduct: false,
        failureProduct: false
      },
      products: [],
      manufacturers: [],
      availabilities: [],
      availabilityData: [],
      pagination: {
        offset: -1, // calculated in this.handlePageClick
        numberPerPage: 30,
        pageCount: -1, // calculated in this.handlePageClick
        currentData: [] // init on componentDidMount, then products slice via this.handlePageClick
      }
    }
  }

  componentDidMount() {
    const productStatus: productStatusType = { ...this.state.productStatus };

    // Populate products and manufacturers state & sessionStorage
    if (!productStatus.pendingProduct) {
      const product: string = this.props.slug // Product name from router slug
      this.getProductList(product);
    }
    this.selectedProduct()
    this.setupNavClick()
  }

  componentDidUpdate() {
    const availabilityData: rawType = [ ...this.state.availabilityData ]
    let manufacturer: string;
    availabilityData.forEach((item, index) => {
      if (!Object.values(item)[0].parsed) {
        manufacturer = Object.keys(availabilityData[index])[0];

        let ind: number;
        let tags: Array<string> | null;
        let products: productsType;
        products = [ ...this.state.products ];

        const getSafe = (fn, defaultVal = null) => {
          // Try returns products[ind].availability that are not null, catch discards the rest
          try {
            return fn();
          } catch (e) {
            return defaultVal;
          }
        }

        Object.values(item)[0].availabilityRaw.forEach(value => {
          tags = value.DATAPAYLOAD.match(/<INSTOCKVALUE>(.*)<\/INSTOCKVALUE>/);
          ind = products.findIndex(product => product.id === value.id.toLowerCase());

          if (tags) {
            // product[ind].availability can be null, as products is a lot smaller list than all manufacturer listings
            if (tags[1] === "OUTOFSTOCK") {
              getSafe(() => products[ind].availability = "Out of Stock")
            } else if (tags[1] === "INSTOCK") {
              getSafe(() => products[ind].availability = "In Stock")
            } else if (tags[1] === "LESSTHAN10") {
              getSafe(() => products[ind].availability = "Less Than 10")
            }
          }
        })
        availabilityData[index][manufacturer].parsed = true;
        this.setState({ products, availabilityData })
      }
    })
  }

  componentWillUnmount() {
    const controller = this.state.controller;
    controller.abort()
  }

  protected handlePageClick = (data: pageClickType): void => {
    const pagination: paginationType = { ...this.state.pagination };
    const products: productsType = [ ...this.state.products ];
    let selected: number = data.selected; // (0, 1, 2, 3...)
    pagination.offset = Math.ceil(selected * pagination.numberPerPage);
    pagination.currentData = products.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
    this.setState({ pagination });
  };

  protected getProductList(product: string): void {
    const productURL: string = process.env.REACT_APP_PRODUCT_URL!
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!
    const productStatus: productStatusType = { ...this.state.productStatus };
    const controller = this.state.controller;
    const signal = controller.signal;

    const headers: HeadersInit = {
      'Target-URL': `${productURL}${product}`,
      'Web-Token': webToken,
      'Version': 'v2'
    }

    const opts: RequestInit = {
      headers,
      signal
    }
    const url: string = process.env.REACT_APP_PROXY_URL! // TODO: Replace with production value

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
          let products: productsType = [];
          let manufacturers: manufacturersType; // Array of manufacturer strings
          data.forEach(item => {
            manufacturers = [...this.state.manufacturers]
            // Track availability per product
            item['availability'] = "";
            // Save unique manufacturers to state
            if (!manufacturers.includes(item.manufacturer)) {
              this.setState({
                manufacturers: [...this.state.manufacturers, item.manufacturer],
              })
            }
            // Build the products list
            products.push(item)
          })
          // Save products 0 to 19 to initial currentData
          const pagination: paginationType = { ...this.state.pagination } // empty []
          pagination.currentData = products.slice(0, pagination.offset + pagination.numberPerPage + 1)
          // Save the products list
          this.setState({ products, pagination })

          // Save data to session storage if that product does not have one
          if (!productsRef) {
            sessionStorage.setItem(`${product}`, JSON.stringify(data));
          }

          manufacturers = [...this.state.manufacturers]
          let availability: manufacturerType;
          manufacturers.forEach(manufacturer => {
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

    const fetchAvailabilities = async (url: string, opts: RequestInit): Promise<availabilityAPIStatus | undefined> => {
      let data: availabilityAPIStatus;
      let availabilities: availabilitiesType = [ ...this.state.availabilities ];
      let manufacturers: manufacturersType = [...this.state.manufacturers];
      try {
          let response = await fetch(url, opts)
          data = await response.json()

        if (await Array.isArray(data.response) && data.response.length) {
          const availabilityRaw: availabilitiesAPIType = data.response;
          const availabilityData: rawType =  [ ...this.state.availabilityData ]

         // Save raw availability data to state
          availabilityData.push(
            {
              [manufacturer]: {
              availabilityRaw: availabilityRaw,
              parsed: false
            }
          })

          availabilities = [...this.state.availabilities];
          manufacturers = [...this.state.manufacturers];

          availabilities[manufacturers.indexOf(manufacturer)][manufacturer].pendingAvailability = false;
          availabilities[manufacturers.indexOf(manufacturer)][manufacturer].successAvailability = true;
          this.setState({ availabilities, availabilityData });


        } else if (await !Array.isArray(data.response) && !availabilities[manufacturers.indexOf(manufacturer)][manufacturer].successAvailability) {
          fetchAvailabilities(url, opts);
        }
      } catch(err) {
         // TODO: Handle
         return err
      }
    }
    const availabilityURL: string = process.env.REACT_APP_AVAILABILITY_URL!
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!
    const controller = this.state.controller;
    const signal = controller.signal;

    const headers: HeadersInit = {
      'Target-URL': `${availabilityURL}${manufacturer}`,
      'Web-Token': webToken,
      'Version': 'v2'
    }

    const opts: RequestInit = {
      headers,
      signal
    }

    const url: string = process.env.REACT_APP_PROXY_URL! // TODO: Replace with production value
    const availabilities: availabilitiesType = [ ...this.state.availabilities ];
    const manufacturers: manufacturersType = [...this.state.manufacturers];
    // initial fetch for a manufacturer
    if (!availabilities[manufacturers.indexOf(manufacturer)][manufacturer].pendingAvailability) {
      availabilities[manufacturers.indexOf(manufacturer)][manufacturer].pendingAvailability = true;
      this.setState({ availabilities });
      fetchAvailabilities(url, opts);
    }
  }

  protected setupNavClick() {
    const beanies: Element | null = document.querySelector('.beanies-nav');
    const facemasks: Element | null = document.querySelector('.facemasks-nav');
    const gloves: Element | null = document.querySelector('.gloves-nav');
    const beaniesLink: Element | null = document.querySelector('.beanies-link');
    const facemasksLink: Element | null = document.querySelector('.facemasks-link');
    const glovesLink: Element | null = document.querySelector('.gloves-link');

    const handleNavClick = e => {
      // Clicked product should be only active product in nav
      if (beaniesLink !== null && beaniesLink === e.target) {
        glovesLink!.classList.remove('active');
        facemasksLink!.classList.remove('active');
      } else if (facemasksLink !== null && facemasksLink === e.target) {
        beaniesLink!.classList.remove('active');
        glovesLink!.classList.remove('active');
      } else if (glovesLink !== null && glovesLink === e.target) {
        beaniesLink!.classList.remove('active');
        facemasksLink!.classList.remove('active');
      }

      e.target.classList.add("active");
    }
    beanies?.addEventListener("click", handleNavClick);
    facemasks?.addEventListener("click", handleNavClick);
    gloves?.addEventListener("click", handleNavClick);
  }

  protected selectedProduct() {
    // Select the nav product in view at load
    if (this.props.slug === 'beanies') {
      const beaniesLink: Element | null = document.querySelector('.beanies-link');
      beaniesLink!.classList.add('active');
    } else if (this.props.slug === 'facemasks') {
      const facemasksLink: Element | null = document.querySelector('.facemasks-link');
      facemasksLink!.classList.add('active');
    } else if (this.props.slug === 'gloves') {
      const glovesLink: Element | null = document.querySelector('.gloves-link');
      glovesLink!.classList.add('active');
    }
  }

  render() {
    const productStatus: productStatusType = { ...this.state.productStatus }

    if (!productStatus.pendingProduct && productStatus.successProduct) {
      // Render product list data
      return (
        <div className='product-list'>
          <ProductList products={this.state.pagination.currentData}/>
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            pageCount={this.state.products.length / this.state.pagination.numberPerPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
          />
        </div>

      )
    } else  if (productStatus.failureProduct) {
      // Handle if no products to display
      console.log('failure')
    }
    return (
      <div className="spinner-div">
        <Spinner animation="border" role="status" variant="primary" className="product-spinner">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )
  }

}

export default App;
