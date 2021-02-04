import React from 'react';
import App from './App';

interface Props {
  slug: string
}

class Facemasks extends React.Component<Props> {
  render() {
    return(
      <App slug={this.props.slug} />
    )
  }
}

export default Facemasks;
