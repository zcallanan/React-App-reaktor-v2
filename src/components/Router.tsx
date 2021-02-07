import React from 'react';
import { BrowserRouter, Route, Switch, RouteComponentProps, Link } from 'react-router-dom';
import Gloves from './Gloves';
import Beanies from './Beanies';
import Facemasks from './Facemasks';
import NotFound from './NotFound';
import PrintJSON from './PrintJSON';

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
          <Link className="nav-link beanies-link" to="/v2/beanies">Beanies</Link>
        </li>
        <li className="nav-item facemasks-nav">
          <Link className="nav-link facemasks-link" to="/v2/facemasks">Facemasks</Link>
        </li>
        <li className="nav-item gloves-nav">
          <Link className="nav-link gloves-link" to="/v2/gloves">Gloves</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      {/* If slug is one of three products, send slug to App as prop */}
      <Route path="/v2/gloves" render={( {match}: MatchProps) =>
        ( <Gloves slug="gloves" /> )} />
      <Route path="/v2/beanies" render={( {match}: MatchProps) =>
        ( <Beanies slug="beanies" /> )} />
      <Route path="/v2/facemasks" render={( {match}: MatchProps) =>
        ( <Facemasks slug="facemasks" /> )} />
      <Route path="/v2/api/gloves/" render={( {match}: MatchProps) =>
        ( <PrintJSON slug="gloves" /> )} />
      <Route path="/v2/api/beanies/" render={( {match}: MatchProps) =>
        ( <PrintJSON slug="beanies" /> )} />
      <Route path="/v2/api/facemasks/" render={( {match}: MatchProps) =>
        ( <PrintJSON slug="facemasks" /> )} />
      {/* Handle all other routes */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
