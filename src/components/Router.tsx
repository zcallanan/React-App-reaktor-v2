import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Gloves from './Gloves';
import Beanies from './Beanies';
import Facemasks from './Facemasks';
import NotFound from './NotFound';
import PrintJSON from './PrintJSON';
import Nav from './Nav';

const Router = () => (
  <BrowserRouter>
    <Nav />
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
