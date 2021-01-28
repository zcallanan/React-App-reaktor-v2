import React from 'react';

type pendingType = {
  pendingProduct: boolean,
  pendingAvailability: boolean
}

type successType = {
  successProduct: boolean,
  successAvailability: boolean
}

type failureType = {
  failureProduct: boolean,
  failureAvailability: boolean
}

interface Props {
  slug: string
}

interface State {
  pending: pendingType,
  success: successType,
  failure: failureType
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      pending: {
        pendingProduct: false,
        pendingAvailability: false
      },
      success: {
        successProduct: false,
        successAvailability: false
      },
      failure: {
        failureProduct: false,
        failureAvailability: false
      }
    }
  }


  componentDidMount() {
    console.log(this.props.slug) // product name from slug
  }

  render() {

    return (
      <div>Placeholder!</div>
    )
  }

}

export default App;
