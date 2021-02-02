import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { capitalizeFirstLetter } from '../helpers';

interface Props {
  cardData: productType
}

class ProductCard extends React.Component<Props> {
  getAvailability(string: string): JSX.Element | HTMLElement {
    if (string === "") {
      return (
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )
    }
    return (<p>{string}</p>);
  }

  render() {
    const cardData: productType = this.props.cardData;
    let colors: string = "";
    if (cardData.color.length > 1) {
      cardData.color.forEach((color, index) => {
        if (cardData.color.length - 1 === index){
          colors += `${color}`
        } else {
          colors += `${color} | `
        }

      })
    } else {
      colors = cardData.color[0];
    }


    return (
      <div className="product-card">
        <div>
          <p className="product-manufacturer">Manufacturer: {capitalizeFirstLetter(cardData.manufacturer)}</p>
          <p className="product-name">Name: {capitalizeFirstLetter(cardData.name)}</p>
        </div>
        <div>
          <p className="product-price">Price: {cardData.price}</p>
          <p className="">Colors: {colors}</p>
        </div>

        <div>
          {this.getAvailability(cardData.availability)}
        </div>


      </div>
    )
  }
}


export default ProductCard;
