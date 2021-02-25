import React, { useEffect, useState, useReducer, useRef } from 'react';
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
    };
  };
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
    };
  };

  // Initial values
  const statusInitial = {
    pendingProduct: false,
    successProduct: false
  };

  const paginationInitial = {
    offset: -1,
    numberPerPage: 30,
    pageCount: -1,
    currentData: [],
    currentPage: -1
  };

  // Manage state
  const controller = useRef(new AbortController());
  const [statusState, statusDispatch] = useReducer(statusReducer, statusInitial);
  const [products, setProducts] = useState<ProductsType>([]);
  const [paginationState, paginationDispatch] = useReducer(paginationReducer, paginationInitial);

  // Fn to replace URL search query string
  const changeQuerySearch = (currentPage: number): void => {
    history.replace({
      pathname: `/${slug}`,
      search: `?page=${currentPage}`
    });

  };

  // Manage pagination
  const handlePageClick = (data: PageClickType): void => {
    let selected: number = data.selected; // (0, 1, 2, 3...)
    let currentPage: number;

    // Selected starts at 0, pagination starts at 1, so increment
    currentPage = selected + 1;

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
    });

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
    };
    return Number(pageValue);
  };

  useEffect(() => {
    // Assign to a var or React complains
    let controllerValue = controller.current;
    return (): void => {
      // If component unmounts, then abort unresolved fetches on cleanup
      controllerValue.abort();
    };
  }, [controller]);

  useEffect(() => {
    // Setup nav links
    setupNavClick();
    selectedProduct(slug);

    // API request values
    const signal = controller.current.signal;
    let url: string;
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!;

    if (process.env.NODE_ENV === 'test') {
      // Testing requires a string
      url = 'http://localhost:3010/';
    } else {
      url = process.env.REACT_APP_PROXY_URL!;
    };

    const headers: HeadersInit = {
      'X-WEB-TOKEN': webToken,
      'X-VERSION': 'v2',
      'X-PRODUCT': slug
    };

    const opts: RequestInit = {
      headers,
      signal
    };

    // API GET fetch
    const fetchProducts = async (url: string, opts: RequestInit): Promise<ProductsType | undefined> => {
      let data: ProductsAPIType;
      try {
        const response = await fetch(url, opts);
        data = await response.json();

        if (Array.isArray(data[slug]) && data[slug].length) {
          statusDispatch({type: 'SUCCESSTRUE'})
          setProducts(data[slug]);

          // Setup initial currentData
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
          });
        } else {
          if (!statusState.successProduct) {
            statusDispatch({type: 'PENDINGTRUE'})
            fetchProducts(url, opts);
          };
        };
      } catch(err) {
         console.log(err);
         return err;
      };
    };
    // Initital fetch products call. fetchMock is used in tests.
    if (!products.length && process.env.NODE_ENV !== 'test') {
      fetchProducts(url, opts);
    };
  }, [slug, paginationState.numberPerPage, products.length, statusState.successProduct]);

  if (!statusState.pendingProduct && statusState.successProduct) {
    let searchQueryArray: Array<string> | null = history?.location.search.match(/\d+/)!;
    let searchQuery: string | number = (searchQueryArray === null) ? 's' : searchQueryArray[0];
    let selectedValue: number;

    if (Number(searchQuery)) {
      // If URL search query value is a number, then selectedValue is 1 less than the page number (selected starts at 0)
      selectedValue = Number(searchQuery) - 1;
    } else {
      // If URL search query is not a number, then start at selected index 0
      selectedValue = 0;
    };

    // Render product list data
    return (
      <div className='product-list'>
        <ProductList products={paginationState.currentData}/>
        <ReactPaginate
          initialPage={selectedValue}
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
    );
  } else {
    return (
      <div className="spinner-div">
        <Spinner animation="border" role="status" variant="dark" className="product-spinner">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  };
};

export default App;
