import React from 'react';
import ProductCard from './ProductCard';

interface Props {
  products: ProductsType
}

class ProductList extends React.Component<Props> {
  render() {
    const products = this.props.products;
    const productCards: Array<JSX.Element> = [];
    let productKey: string;

    for (let i = 0; i < products.length; i++) {
      productKey = products[i].id.toLowerCase()
      productCards.push(<ProductCard
        key={productKey}
        cardData={products[i]}
      />)
    }

    return(
      <div className="product-card-list">
        {productCards}
      </div>
    )
  }
}

export default ProductList;
