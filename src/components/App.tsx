import React, { useEffect, useState, useReducer } from 'react';
import { setupNavClick, selectedProduct } from '../helpers/nav-links';
import ProductList from './ProductList';
import Spinner from 'react-bootstrap/Spinner';
import ReactPaginate from 'react-paginate';

interface Props {
  slug: string
}

const App = ({ slug }: Props) => {

  // Reducers
  const statusReducer = (state, action) => {
    switch (action.type) {
      case 'PENDINGTRUE':
        return {
          ...state,
          pendingProduct: true
        };
      case 'SUCCESSTRUE':
        return {
          pendingProduct: false,
          successProduct: true
        };
      default:
        throw new Error();
    }
  }
  const paginationReducer = (state, action) => {
    switch (action.type) {
      case 'PAGINATION':
        return {
          ...state,
          offset: action.payload.offset,
          currentData: action.payload.currentData,
          pageCount: action.payload.pageCount
        };
      default:
        throw new Error();
    }
  }

  // Initial values
  const statusInitial = {
    pendingProduct: false,
    successProduct: false
  }

  const paginationInitial = {
    offset: -1,
    numberPerPage: 30,
    pageCount: -1,
    currentData: []
  }

  // Manage state
  const [controller, setController] = useState<AbortController>(new AbortController());
  const [statusState, statusDispatch] = useReducer(statusReducer, statusInitial);
  const [products, setProducts] = useState<ProductsType>([]);
  const [paginationState, paginationDispatch] = useReducer(paginationReducer, paginationInitial);

  // Manage pagination
  const handlePageClick = (data: PageClickType): void => {
    let selected: number = data.selected; // (0, 1, 2, 3...)
    let offset = Math.ceil(selected * paginationState.numberPerPage);
    let currentData = products.slice(offset, offset + paginationState.numberPerPage);
    let pageCount = products.length / paginationState.numberPerPage
    paginationDispatch({
      type: 'PAGINATION',
      payload: {
        offset: offset,
        currentData: currentData,
        pageCount: pageCount
      }
    })
  };

  useEffect(() => {
    // If component unmounts, then abort unresolved fetches
    return (): void => {
      controller.abort();
    }
  }, [controller]);

  useEffect(() => {
    // Setup nav links
    setupNavClick();
    selectedProduct(slug);

    // API request values
    const signal = controller.signal;
    let url: string;
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!;

    if (process.env.NODE_ENV === 'test') {
      // Testing requires a string
      url = 'http://localhost:3010/';
    } else {
      url = process.env.REACT_APP_PROXY_URL!;
    }

    const headers: HeadersInit = {
      'X-WEB-TOKEN': webToken,
      'X-VERSION': 'v2',
      'X-PRODUCT': slug
    }

    const opts: RequestInit = {
      headers,
      signal
    }

    // API GET fetch
    const fetchProducts = async (url: string, opts: RequestInit): Promise<ProductsType | undefined> => {
      let data: ProductsAPIType;
      try {
        const response = await fetch(url, opts);
        data = await response.json();

        if (await Array.isArray(data[slug]) && data[slug].length) {
          statusDispatch({type: 'SUCCESSTRUE'})
          setProducts(data[slug]);

          // Save products 0 to 19 to initial currentData
          let offset = 0;
          let currentData = data[slug].slice(0, offset + paginationState.numberPerPage + 1);
          let pageCount = data[slug].length / paginationState.numberPerPage
          paginationDispatch({
            type: 'PAGINATION',
            payload: {
              currentData: currentData,
              offset: offset,
              pageCount: pageCount
            }
          })
        } else {
          if (!statusState.successProduct) {
            statusDispatch({type: 'PENDINGTRUE'})
            fetchProducts(url, opts);
          }
        }
      } catch(err) {
         console.log(err);
         return err;
      }
    }
    // Initital fetch products call
    if (!products.length) {
      fetchProducts(url, opts);
    }
  }, [slug, paginationState.numberPerPage, products.length, statusState.successProduct, controller.signal]);

  if (!statusState.pendingProduct && statusState.successProduct) {
    // Render product list data
    return (
      <div className='product-list'>
        <ProductList products={paginationState.currentData}/>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          pageCount={products.length / paginationState.numberPerPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
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
        <Spinner animation="border" role="status" variant="dark" className="product-spinner">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    )
  }
}

export default App;
