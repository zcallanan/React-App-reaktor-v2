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
  pagination: paginationType,
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      controller: new AbortController(),
      productStatus: {
        pendingProduct: false,
        successProduct: false
      },
      products: [],
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
    const controller = this.state.controller;
    const signal = controller.signal;
    let url: string;
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!

    if (process.env.NODE_ENV === 'test') {
      // Testing requires a string
      url = 'http://localhost:3010/';
    } else {
      url = process.env.REACT_APP_PROXY_URL!
    }

    const headers: HeadersInit = {
      'X-WEB-TOKEN': webToken,
      'X-VERSION': 'v2',
      'X-PRODUCT': product
    }

    const opts: RequestInit = {
      headers,
      signal
    }

    const fetchProducts = async (url: string, opts: RequestInit): Promise<productsType | undefined> => {
      let data: productsAPIType;
      try {
        const response = await fetch(url, opts)
        data = await response.json()

        if (await Array.isArray(data.rows) && data.rows.length) {
          const productStatus: productStatusType = { ...this.state.productStatus };
          productStatus.pendingProduct = false;
          productStatus.successProduct = true;
          this.setState({ productStatus });
          let products: productsType = [];
          data.rows.forEach(item => {
            // Build the products list
            products.push(item)
          })
          // Save products 0 to 19 to initial currentData
          const pagination: paginationType = { ...this.state.pagination } // empty []
          pagination.currentData = products.slice(0, pagination.offset + pagination.numberPerPage + 1)
          // Save the products list
          this.setState({ products, pagination })
        } else {
          // TODO: Data is empty, handle it
          const productStatus: productStatusType = { ...this.state.productStatus };
          if (!productStatus.successProduct) {
            productStatus.pendingProduct = true;
            this.setState({ productStatus });
            fetchProducts(url, opts);
          }

        }
      } catch(err) {
         console.log(err)
         return err
      }
    }

    const products: productsType = { ...this.state.products }
    if (!products.length) {
      fetchProducts(url, opts);
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
      if (beaniesLink !== null) {
        beaniesLink!.classList.add('active');
      }
    } else if (this.props.slug === 'facemasks') {
      const facemasksLink: Element | null = document.querySelector('.facemasks-link');
      if (facemasksLink !== null) {
        facemasksLink!.classList.add('active');
      }
    } else if (this.props.slug === 'gloves') {
      const glovesLink: Element | null = document.querySelector('.gloves-link');
      if (glovesLink !== null) {
        glovesLink!.classList.add('active');
      }
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
    } else {
      return (
        <div className="spinner-div">
          <Spinner animation="border" role="status" variant="primary" className="product-spinner">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }

  }

}

export default App;
