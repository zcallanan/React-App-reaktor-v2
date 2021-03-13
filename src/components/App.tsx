import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useCallback,
} from "react";
import { History } from "history";
import Spinner from "react-bootstrap/Spinner";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import ProductList from "./ProductList";
import {
  ProductType,
  PageClickType,
  ProductsAPIType,
} from "../types";

interface Props {
  slug: string;
}

const App = ({ slug }: Props): JSX.Element => {
  // Reducers
  const statusReducer = (state, action) => {
    switch (action.type) {
      case "PENDINGTRUE":
        return {
          ...state,
          pendingProduct: true,
        };
      case "SUCCESSTRUE":
        return {
          pendingProduct: false,
          successProduct: true,
        };
      default:
        throw new Error();
    }
  };

  const paginationReducer = (state, action) => {
    switch (action.type) {
      case "PAGINATION":
        return {
          ...state,
          offset: action.payload.offset,
          currentData: action.payload.currentData,
          pageCount: action.payload.pageCount,
          currentPage: action.payload.currentPage,
        };
      default:
        throw new Error();
    }
  };

  // Initial values
  const statusInitial = {
    pendingProduct: false,
    successProduct: false,
  };

  const paginationInitial = {
    offset: -1,
    numberPerPage: 30,
    pageCount: -1,
    currentData: [],
    currentPage: -1,
  };

  // History
  const history: History = useHistory();
  const searchQueryRaw = history.location.search.match(/\d+/)!;

  // Fetch cancel
  const controller = useRef<AbortController>(new AbortController());

  // Manage state
  const [statusState, statusDispatch] = useReducer(
    statusReducer,
    statusInitial,
  );
  const [products, setProducts] = useState<ProductType[]>([]);
  const [paginationState, paginationDispatch] = useReducer(
    paginationReducer,
    paginationInitial,
  );

  // Fn to replace URL search query string
  const changeQuerySearch = (currentPage: number): void => {
    history.replace({
      pathname: `/${slug}`,
      search: `?page=${currentPage}`,
    });
  };

  // Manage pagination
  const handlePageClick = (data: PageClickType): void => {
    // eslint-disable-next-line prefer-destructuring
    const selected: number = data.selected; // (0, 1, 2, 3...)

    // Selected starts at 0, pagination starts at 1, so increment
    const currentPage: number = selected + 1;

    const offset = Math.ceil(selected * paginationState.numberPerPage);
    const currentData = products.slice(
      offset,
      offset + paginationState.numberPerPage,
    );
    const pageCount = products.length / paginationState.numberPerPage;

    // Save pagination values
    paginationDispatch({
      type: "PAGINATION",
      payload: {
        offset,
        currentData,
        pageCount,
        currentPage,
      },
    });

    // Update the URL query search param
    changeQuerySearch(currentPage);
  };

  const validateSearchQuery = useCallback(
    (pageValue: number | string): number => {
      if (typeof pageValue === "string" && Number(pageValue)) {
        // Value is a string, but can be converted to a number
        // Validate it again in case the string-converted number is out of range
        validateSearchQuery(Number(pageValue) - 1);
      } else if (typeof pageValue !== "number" || pageValue < 1) {
        // NaN or less than 1
        return 1;
      } else if (
        typeof pageValue === "number" && pageValue > paginationState.pageCount
      ) {
        // pageValue number out of range
        return paginationState.pageCount;
      }
      return Number(pageValue);
    },
    [paginationState.pageCount],
  );

  useEffect(() => {
    // Assign to a var or React complains
    const controllerValue = controller;
    return (): void => {
      // If component unmounts, then abort unresolved fetches on cleanup
      controllerValue.current.abort();
    };
  }, [controller]);

  useEffect(() => {
    // API request values
    // eslint-disable-next-line prefer-destructuring
    const signal: AbortSignal = controller.current.signal;
    const url: string = process.env.REACT_APP_PROXY_URL!;
    const webToken: string = process.env.REACT_APP_WEB_TOKEN!;

    const headers: HeadersInit = {
      "X-WEB-TOKEN": webToken,
      "X-VERSION": "v2",
      "X-PRODUCT": slug,
    };

    const opts: RequestInit = {
      headers,
      signal,
    };

    // API GET fetch
    const fetchProducts = async (
      fetchUrl: string,
      options: RequestInit,
    ): Promise<void | undefined> => {
      let data: ProductsAPIType;
      try {
        const response = await fetch(url, opts);
        data = await response.json();

        if (Array.isArray(data[slug]) && data[slug].length) {
          statusDispatch({ type: "SUCCESSTRUE" });
          setProducts(data[slug]);

          // Setup initial currentData

          const currentPage: number = searchQueryRaw[0] === null
            ? 1
            : validateSearchQuery(searchQueryRaw[0]);
          const offset = Math.ceil(
            (currentPage - 1) * paginationState.numberPerPage,
          );
          const currentData = data[slug].slice(
            offset,
            offset + paginationState.numberPerPage,
          );
          const pageCount = data[slug].length / paginationState.numberPerPage;
          paginationDispatch({
            type: "PAGINATION",
            payload: {
              currentData,
              offset,
              pageCount,
              currentPage,
            },
          });
        } else if (!statusState.successProduct) {
          // Empty array or string, request again
          statusDispatch({ type: "PENDINGTRUE" });
          fetchProducts(url, opts);
        }
        return await new Promise<void>((resolve) => resolve());
      } catch (err) {
        // Malformed JSON, request again
        fetchProducts(url, opts);
        console.log(err);
        return err;
      }
    };
    // Initital fetch products call. fetchMock is used in tests.
    if (!products.length && process.env.NODE_ENV !== "test") {
      fetchProducts(url, opts);
    }
  }, [
    slug,
    paginationState.numberPerPage,
    products.length,
    statusState.successProduct,
    history?.location.search,
    validateSearchQuery,
    searchQueryRaw,
  ]);

  if (!statusState.pendingProduct && statusState.successProduct) {
    const searchQueryVal: string | number = searchQueryRaw === null
      ? "s"
      : searchQueryRaw[0];
    let selectedValue: number;

    if (Number(searchQueryVal)) {
      /* If URL search query value is a number, then selectedValue is 1 less
      than the page number (selected starts at 0) */
      selectedValue = Number(searchQueryVal) - 1;
    } else {
      // If URL search query is not a number, then start at selected index 0
      selectedValue = 0;
    }

    // Render product list data
    return (
      <div className="product-list">
        <ProductList products={paginationState.currentData} />
        <ReactPaginate
          initialPage={selectedValue}
          previousLabel="previous"
          nextLabel="next"
          breakLabel="..."
          pageCount={products.length / paginationState.numberPerPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          subContainerClassName="pages pagination"
          activeClassName="active"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
        />
      </div>
    );
  }
  return (
    <div className="spinner-div">
      <Spinner
        animation="border"
        role="status"
        variant="dark"
        className="product-spinner"
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export default App;
