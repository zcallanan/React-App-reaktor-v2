import React from "react";
import Spinner from "react-bootstrap/Spinner";
import capitalizeFirstLetter from "../helpers/capitalize-first-letter";
import { ProductType } from "../types";

interface Props {
  cardData: ProductType;
}

const getAvailability = (string: string): JSX.Element | HTMLElement => {
  if (string === "") {
    return (
      <Spinner animation="border" role="status" variant="dark">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
  return <p className="product-availability">{string}</p>;
};

const ProductCard = (props: Props): JSX.Element => {
  const { cardData } = props;

  return (
    <div className="product-card">
      <div className="product-info-left">
        <p className="product-manufacturer">
          <strong>Manufacturer:</strong>
          {" "}
          {capitalizeFirstLetter(cardData.manufacturer)}
        </p>
        <p className="product-name">
          <strong>Name:</strong>
          {capitalizeFirstLetter(cardData.name)}
        </p>
      </div>
      <div className="product-info-center">
        <p className="product-price">
          <strong>Price:</strong>
          {cardData.price}
          €
        </p>
        <p className="product-colors">
          <strong>Colors:</strong>
          {capitalizeFirstLetter(cardData.color)}
        </p>
      </div>

      <div className="product-info-right">
        {getAvailability(cardData.availability)}
      </div>
    </div>
  );
};

export default ProductCard;
