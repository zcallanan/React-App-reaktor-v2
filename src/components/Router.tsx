import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Gloves from './Gloves';
import Beanies from './Beanies';
import Facemasks from './Facemasks';
import NotFound from './NotFound';
import PrintJSON from './PrintJSON';

const Router = () => (
  <BrowserRouter>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item beanies-nav">
          <Link className="nav-link beanies-link" to="/beanies?page=1">Beanies</Link>
        </li>
        <li className="nav-item facemasks-nav">
          <Link className="nav-link facemasks-link" to="/facemasks?page=1">Facemasks</Link>
        </li>
        <li className="nav-item gloves-nav">
          <Link className="nav-link gloves-link" to="/gloves?page=1">Gloves</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      {/* If slug is one of three products, send slug to App as prop */}
      <Route path="/beanies">
         <Beanies slug="beanies" />
      </Route>
      <Route path="/facemasks">
         <Facemasks slug="facemasks" />
      </Route>
      <Route path="/gloves">
         <Gloves slug="gloves" />
      </Route>
      <Route path="/api/beanies">
         <PrintJSON slug="beanies" />
      </Route>
      <Route path="/api/facemasks">
         <PrintJSON slug="facemasks" />
      </Route>
      <Route path="/api/gloves">
         <PrintJSON slug="gloves" />
      </Route>
      {/* Handle all other routes */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
