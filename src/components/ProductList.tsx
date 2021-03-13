import React from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "../types";

interface Props {
  products: ProductType[];
}

const ProductList = (props: Props): JSX.Element => {
  const { products } = props;
  const productCards: JSX.Element[] = [];
  let productKey: string;

  for (let i = 0; i < products.length; i += 1) {
    productKey = products[i].id.toLowerCase();
    productCards.push(
      <ProductCard key={productKey} cardData={products[i]} />,
    );
  }

  return <div className="product-card-list">{productCards}</div>;
};

export default ProductList;
