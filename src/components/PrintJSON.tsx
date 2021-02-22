import React, { useEffect, useState, FunctionComponent } from 'react';

interface Props {
  slug: string
}

const setupNavClick = (): void => {
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

const selectedProduct = (slug): void => {
  // Select the nav product in view at load
  if (slug === 'beanies') {
    const beaniesLink: Element | null = document.querySelector('.beanies-link');
    if (beaniesLink !== null) {
      beaniesLink!.classList.add('active');
    }
  } else if (slug === 'facemasks') {
    const facemasksLink: Element | null = document.querySelector('.facemasks-link');
    if (facemasksLink !== null) {
      facemasksLink!.classList.add('active');
    }
  } else if (slug === 'gloves') {
    const glovesLink: Element | null = document.querySelector('.gloves-link');
    if (glovesLink !== null) {
      glovesLink!.classList.add('active');
    }
  }
}

const PrettyPrintJson = ({ slug }: Props) => {
  const [products, setProducts] = useState<ProductsType>([]);

  useEffect(() => {
    setupNavClick();
    selectedProduct(slug);

    const webToken: string = process.env.REACT_APP_WEB_TOKEN!
    const headers: HeadersInit = {
      'X-WEB-TOKEN': webToken,
      'X-VERSION': 'v2',
      'X-PRODUCT': slug
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
    let productResponse: ProductsType = [];

    const fetchProducts = async (url: string, opts: RequestInit): Promise<ProductsType | undefined> => {
      let data: ProductsAPIType;
      try {
        const response = await fetch(url, opts);
        data = await response.json();

        if (await Array.isArray(data[slug]) && data[slug].length) {
          // Save data to local state to render

          data[slug].forEach(item => {
            // Build the products list
            productResponse.push(item)
          })
          // this.setState({ products });
          setProducts(productResponse);
          const value = await productResponse
          return await value;
        } else {
          fetchProducts(url, opts);
        }
      } catch(err) {
         return err;
      }

    }
    fetchProducts(url, opts)
  }, [slug]);

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

export default PrettyPrintJson;
