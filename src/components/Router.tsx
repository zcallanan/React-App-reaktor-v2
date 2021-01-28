import React from 'react';
import { BrowserRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import App from './App';
import NotFound from './NotFound';

interface MatchParams {
    slug: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}

const Router = () => (
  <BrowserRouter>
    <Switch>
      {/* If slug is one of three products, send slug to App as prop */}
      <Route path="/clothing/:slug(gloves|beanies|facemasks)" render={( {match}: MatchProps) =>
        ( <App slug={match.params.slug} /> )} />
      {/* Handle all other routes */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
