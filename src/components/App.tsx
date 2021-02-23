import React, { useEffect, useState, useReducer } from 'react';
import { setupNavClick, selectedProduct } from '../helpers/nav-links';
import ProductList from './ProductList';
import Spinner from 'react-bootstrap/Spinner';
import ReactPaginate from 'react-paginate';
import { useHistory } from "react-router-dom";

interface Props {
  slug: string
}

const App = ({ slug }: Props) => {
  const history = useHistory();

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
          pageCount: action.payload.pageCount,
          currentPage: action.payload.currentPage
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
    currentData: [],
    // currentPage: Number.parseInt(history?.location.search.match(/\d+/)![0], 10)
    currentPage: -1
  }

  // Manage state
  const [controller, setController] = useState<AbortController>(new AbortController());
  const [statusState, statusDispatch] = useReducer(statusReducer, statusInitial);
  const [products, setProducts] = useState<ProductsType>([]);
  const [paginationState, paginationDispatch] = useReducer(paginationReducer, paginationInitial);

  // Fn to replace URL search query string
  const changeQuerySearch = (currentPage: number): void => {
    history.replace({
      pathname: `/v2/${slug}`,
      search: `?page=${currentPage}`
    });

  };

  // Manage pagination
  const handlePageClick = (data: PageClickType): void => {
    let selected: number = data.selected; // (0, 1, 2, 3...)
    let currentPage: number;

    if (typeof(selected) === 'string' && Number(selected)) {
      // Should not occur, but selected can be a string from URL or nav links
      selected = Number(selected);
      currentPage = selected;
    } else {
      // Selected starts at 0, pagination starts at 1, so increment
      currentPage = selected + 1;
    }

    if (currentPage === 0) {
      currentPage = 1;
      selected = 0
    }

    let offset = Math.ceil(selected * paginationState.numberPerPage);
    let currentData = products.slice(offset, offset + paginationState.numberPerPage);
    let pageCount = products.length / paginationState.numberPerPage

    // Save pagination values
    paginationDispatch({
      type: 'PAGINATION',
      payload: {
        offset: offset,
        currentData: currentData,
        pageCount: pageCount,
        currentPage: currentPage
      }
    })

    // Update the URL query search param
    changeQuerySearch(currentPage);
  };

  const validateSearchQuery = (pageValue: number | string): number => {
    if (typeof(pageValue) === 'string' && Number(pageValue)) {
      // Value is a string, but can be converted to a number
      // Validate it again in case the string-converted number is out of range
      validateSearchQuery(Number(pageValue) - 1);
    } else if (typeof(pageValue) !== 'number' || pageValue < 1) {
      // NaN or less than 1
      return 1;
    } else if (typeof(pageValue) === 'number' && pageValue > paginationState.pageCount) {
      // pageValue number out of range
      return paginationState.pageCount;
    }
    return Number(pageValue);
  }

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

          // Setup initial currentData
          // let currentPage = Number.parseInt(history?.location.search.match(/\d+/)![0], 10);
          let currentPage: number = validateSearchQuery(history?.location.search.match(/\d+/)![0]);
          let offset = Math.ceil((currentPage - 1) * paginationState.numberPerPage);
          let currentData = data[slug].slice(offset, offset + paginationState.numberPerPage);
          let pageCount = data[slug].length / paginationState.numberPerPage
          paginationDispatch({
            type: 'PAGINATION',
            payload: {
              currentData: currentData,
              offset: offset,
              pageCount: pageCount,
              currentPage: currentPage
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
    let val: Array<string> | null = history?.location.search.match(/\d+/)!;
    let pageValue: string | number = (val === null) ? 1 : val[0];

    if (typeof(pageValue) === 'string' && Number(pageValue)) {
      // Search pageValue is a string if it comes from URL or nav links
      // In this case, subtract 1 so that it does not increment in handlePageClick
      pageValue = Number(pageValue) - 1;
    } else if (typeof(pageValue) !== 'number' || pageValue < 1) {
      pageValue = 1;
    } else if (typeof(pageValue) === 'number' && pageValue > paginationState.pageCount) {
      pageValue = paginationState.pageCount;
    }
    if (pageValue = 0) {
      pageValue = 1
    }

    // Render product list data
    return (
      <div className='product-list'>
        <ProductList products={paginationState.currentData}/>
        <ReactPaginate
          initialPage={pageValue}
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
