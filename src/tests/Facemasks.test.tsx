import React from "react";
import Router from '../components/Router';
import Facemasks from '../components/Facemasks';
import { MemoryRouter } from "react-router-dom";
import { act } from 'react-dom/test-utils';

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

describe('<Facemasks> Component Tests', () => {
  fetch.mockResponse(JSON.stringify({"rows":
    [
      {"id":"ccd1da35142c4d7ece61b7","type":"facemasks","name":"AKTAIFOL FANTASY","color":"white","price":11,"manufacturer":"niksleh","availability":"In Stock"},
      {"id":"1fc9a15517b1d22953c","type":"facemasks","name":"EMAK FLOWER","color":"purple","price":45,"manufacturer":"okkau","availability":"Less Than 10"},
      {"id":"6825e2648c4af44cf971a4","type":"facemasks","name":"MOHEMLEA ROOM","color":"blue","price":94,"manufacturer":"laion","availability":"Out of Stock"}
    ]
  }))

  test('Facemasks Product List component displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/facemasks"]} ><Facemasks slug="facemasks" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductList')).toHaveLength(1);
    component.unmount()
  })

  test('Facemasks Product Card components are displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/facemasks"]} ><Facemasks slug="facemasks" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductCard')).toHaveLength(3);
    component.unmount()
  })

  test('Facemasks product data is displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/facemasks"]} ><Facemasks slug="facemasks" /></MemoryRouter>)
    });
    component.update()
    expect(component.text().includes('Emak Flower')).toBe(true);
    component.unmount()
  })
})
