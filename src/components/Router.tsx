import React from 'react';
import { BrowserRouter, Route, Switch, RouteComponentProps, Link } from 'react-router-dom';
// import App from './App';
import Gloves from './Gloves';
import Beanies from './Beanies';
import Facemasks from './Facemasks';
import NotFound from './NotFound';

interface MatchParams {
    slug: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}

const Router = () => (
  <BrowserRouter>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item beanies-nav">
          <Link className="nav-link beanies-link" to="/clothing/beanies">Beanies</Link>
        </li>
        <li className="nav-item gloves-nav">
          <Link className="nav-link gloves-link" to="/clothing/gloves">Gloves</Link>
        </li>
        <li className="nav-item facemasks-nav">
          <Link className="nav-link facemasks-link" to="/clothing/facemasks">Facemasks</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      {/* If slug is one of three products, send slug to App as prop */}
      <Route path="/clothing/gloves" render={( {match}: MatchProps) =>
        ( <Gloves slug="gloves" /> )} />
      <Route path="/clothing/beanies" render={( {match}: MatchProps) =>
        ( <Beanies slug="beanies" /> )} />
      <Route path="/clothing/facemasks" render={( {match}: MatchProps) =>
        ( <Facemasks slug="facemasks" /> )} />
      {/* Handle all other routes */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
