import React, { useEffect, useState } from 'react';
import { setupNavClick, selectedProduct } from '../helpers/nav-links';

interface Props {
  slug: string
};

const PrintJSON = ({ slug }: Props) => {
  const [products, setProducts] = useState<ProductsType>([]);

  useEffect(() => {
    setupNavClick();
    selectedProduct(slug);

    const webToken: string = process.env.REACT_APP_WEB_TOKEN!;
    const headers: HeadersInit = {
      'X-WEB-TOKEN': webToken,
      'X-VERSION': 'v2',
      'X-PRODUCT': slug
    };

    const opts: RequestInit = {
      headers
    };

    let url: string;
    if (process.env.NODE_ENV === 'test') {
      // Testing requires a string
      url = 'http://localhost:3010/';
    } else {
      url = process.env.REACT_APP_PROXY_URL!;
    };

    const fetchProducts = async (url: string, opts: RequestInit): Promise<ProductsType | undefined> => {
      let data: ProductsAPIType;
      try {
        const response = await fetch(url, opts);
        data = await response.json();

        if (await Array.isArray(data[slug]) && data[slug].length) {
          setProducts(data[slug]);
        } else {
          // If we don't get data back, try again
          fetchProducts(url, opts);
        };
      } catch(err) {
         return err;
      };
    };
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
};

export default PrintJSON;
