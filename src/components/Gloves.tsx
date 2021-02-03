import React from 'react';
import App from './App';

interface Props {
  slug: string
}

class Gloves extends React.Component<Props> {

  render() {
    return(
      <div className="container">
        <App slug={this.props.slug} />
      </div>
    )
  }
}

export default Gloves;
