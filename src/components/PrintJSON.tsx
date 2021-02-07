import React from 'react';

interface Props {
    slug: string
  }

  interface State {
    products: productsType,
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
    const product: string = this.props.slug // Product name from router slug
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

  protected getProductList(product: string): void {
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!
    const headers: HeadersInit = {
        'Web-Token': webToken,
        'Version': 'v2',
        'Product': product
      }

      const opts: RequestInit = {
        headers
      }
      const url: string = process.env.REACT_APP_PROXY_URL! // TODO: Replace with production value

    const fetchProducts = async (url: string, opts: RequestInit): Promise<productsType | undefined> => {
      let data: productsAPIType;
      try {
        const response = await fetch(url, opts)
        data = await response.json()

        if (await Array.isArray(data.rows) && data.rows.length) {
          // Save data to local state to render
          let products: productsType = [];
          data.rows.forEach(item => {
            // Build the products list
            products.push(item)
          })
          this.setState({ products });
        } else {
          // TODO: Data is empty, handle it
          fetchProducts(url, opts);
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

  render() {
    const products: productsType = { ...this.state.products };
    return (
      <div >
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
