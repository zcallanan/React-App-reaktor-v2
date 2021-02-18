import React from "react";
import Router from '../components/Router';
import Facemasks from '../components/Facemasks';
import PrintJSON from '../components/PrintJSON';
import { MemoryRouter } from "react-router-dom";
import { act } from 'react-dom/test-utils';
import isJSON from '../helpers/is-json';

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

describe('<Facemasks> Component Tests', () => {
  fetch.mockResponse(JSON.stringify({"rows":
    [
      {"id":"ccd1da35142c4d7ece61b7","type":"facemasks","name":"AKTAIFOL FANTASY","color":"white","price":11,"manufacturer":"niksleh","availability":"In Stock"},
      {"id":"1fc9a15517b1d22953c","type":"facemasks","name":"EMAK FLOWER","color":"purple, black","price":45,"manufacturer":"okkau","availability":"Less Than 10"},
      {"id":"6825e2648c4af44cf971a4","type":"facemasks","name":"MOHEMLEA ROOM","color":"blue, green","price":94,"manufacturer":"laion","availability":"Out of Stock"}
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

  test('Facemasks Product Card components and data are displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/facemasks"]} ><Facemasks slug="facemasks" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductCard')).toHaveLength(3);
    expect(component.find('.product-manufacturer').first().text().includes('Manufacturer: Niksleh')).toBe(true);
    expect(component.find('.product-manufacturer').at(1).text().includes('Manufacturer: Okkau')).toBe(true);
    expect(component.find('.product-manufacturer').last().text().includes('Manufacturer: Laion')).toBe(true);
    expect(component.find('.product-name').first().text().includes('Name: Aktaifol Fantasy')).toBe(true);
    expect(component.find('.product-name').at(1).text().includes('Name: Emak Flower')).toBe(true);
    expect(component.find('.product-name').last().text().includes('Name: Mohemlea Room')).toBe(true);
    expect(component.find('.product-colors').first().text().includes('Colors: White')).toBe(true);
    expect(component.find('.product-colors').at(1).text().includes('Colors: Purple, Black')).toBe(true);
    expect(component.find('.product-colors').last().text().includes('Colors: Blue, Green')).toBe(true);
    expect(component.find('.product-price').first().text().includes('Price: 11 €')).toBe(true);
    expect(component.find('.product-price').at(1).text().includes('Price: 45 €')).toBe(true);
    expect(component.find('.product-price').last().text().includes('Price: 94 €')).toBe(true);
    expect(component.find('.product-availability').first().text().includes('In Stock')).toBe(true);
    expect(component.find('.product-availability').at(1).text().includes('Less Than 10')).toBe(true);
    expect(component.find('.product-availability').last().text().includes('Out of Stock')).toBe(true);
    component.unmount()
  })

  test('Facemasks PrintJSON component', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/api/facemasks"]} ><PrintJSON slug="facemasks" /></MemoryRouter>)
    });
    component.update()
    expect(component.find(PrintJSON)).toHaveLength(1);
    // Test if valid JSON is displayed
    expect(isJSON(component.find('span').children().text())).toBe(true);
    component.unmount()
  })
})
