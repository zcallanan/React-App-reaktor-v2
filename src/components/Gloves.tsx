import React from "react";
import App from "./App";

interface Props {
  slug: string;
}

const Gloves = (props: Props): JSX.Element => {
  const { slug } = props;
  return (
    <div className="container">
      <App slug={slug} />
    </div>
  );
};

export default Gloves;
