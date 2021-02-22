import React from 'react';

interface Props {
  slug: string
}

interface State {
  products: ProductsType
}

class PrettyPrintJson extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      products: []
    }
  }

  componentDidMount() {
    // Populate products and manufacturers state & sessionStorage
    const product: string = this.props.slug; // Product name from router slug
    this.getProductList(product);
    this.setupNavClick();
    this.selectedProduct();
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
      if (glovesLink !== null && beaniesLink !== null && facemasksLink !== null ) {
        if (beaniesLink === e.target) {
          glovesLink!.classList.remove('active');
          facemasksLink!.classList.remove('active');
        } else if (facemasksLink === e.target) {
          beaniesLink!.classList.remove('active');
          glovesLink!.classList.remove('active');
        } else if (glovesLink === e.target) {
          beaniesLink!.classList.remove('active');
          facemasksLink!.classList.remove('active');
        }
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

  protected getProductList(product: string): void {
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!
    const headers: HeadersInit = {
        'X-WEB-TOKEN': webToken,
        'X-VERSION': 'v2',
        'X-PRODUCT': product
      }

      const opts: RequestInit = {
        headers
      }

      let url: string;
      if (process.env.NODE_ENV === 'test') {
        // Testing requires a string
        url = 'http://localhost:3010/';
      } else {
        url = process.env.REACT_APP_PROXY_URL!;
      }

    const fetchProducts = async (url: string, opts: RequestInit): Promise<ProductsType | undefined> => {
      let data: ProductsAPIType;
      try {
        const response = await fetch(url, opts);
        data = await response.json();

        if (await Array.isArray(data[product]) && data[product].length) {
          // Save data to local state to render
          let products: ProductsType = [];
          data[product].forEach(item => {
            // Build the products list
            products.push(item)
          })
          this.setState({ products });
        } else {
          fetchProducts(url, opts);
        }
      } catch(err) {
         return err;
      }
    }

    const products: ProductsType = { ...this.state.products }
    if (!products.length) {
      fetchProducts(url, opts);
    }
  }

  render() {
    const products: ProductsType = { ...this.state.products };
    return (
      <div className="json-div">
        <pre>
          <span className="pre-font">
            {JSON.stringify(products, null, 2) }
          </span>
        </pre>
      </div>
    );
  }
}

export default PrettyPrintJson;
