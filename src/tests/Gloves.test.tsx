import React from "react";
import Router from '../components/Router';
import Gloves from '../components/Gloves';
import { MemoryRouter } from "react-router-dom";
import { act } from 'react-dom/test-utils';

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

describe('<Glove> Component Tests', () => {
  fetch.mockResponse(JSON.stringify({"rows":
    [
      {"id":"7c3149c69aeb51e167d6","type":"gloves","name":"AKFOLHEM EARTH","color":"red","price":11,"manufacturer":"juuran","availability":"In Stock"},
      {"id":"da35e621ad262615e2fa9e5","type":"gloves","name":"DALLEAKOL NORMAL","color":"red","price":64,"manufacturer":"hennex","availability":"Less Than 10"},
      {"id":"1b1610b94d3d1d701b0","type":"gloves","name":"HEMFOLNY SLIP METROPOLIS","color":"black, blue","price":54,"manufacturer":"umpante","availability":"Out of Stock"}
    ]
  }))

  test('Glove Product List component displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/gloves"]} ><Gloves slug="gloves" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductList')).toHaveLength(1);
    component.unmount()
  })

  test('Glove Product Card components and data are displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/gloves"]} ><Gloves slug="gloves" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductCard')).toHaveLength(3);
    expect(component.find('.product-manufacturer').first().text().includes('Manufacturer: Juuran')).toBe(true);
    expect(component.find('.product-manufacturer').at(1).text().includes('Manufacturer: Hennex')).toBe(true);
    expect(component.find('.product-manufacturer').last().text().includes('Manufacturer: Umpante')).toBe(true);
    expect(component.find('.product-name').first().text().includes('Name: Akfolhem Earth')).toBe(true);
    expect(component.find('.product-name').at(1).text().includes('Name: Dalleakol Normal')).toBe(true);
    expect(component.find('.product-name').last().text().includes('Name: Hemfolny Slip Metropolis')).toBe(true);
    expect(component.find('.product-colors').first().text().includes('Colors: Red')).toBe(true);
    expect(component.find('.product-colors').at(1).text().includes('Colors: Red')).toBe(true);
    expect(component.find('.product-colors').last().text().includes('Colors: Black, Blue')).toBe(true);
    expect(component.find('.product-price').first().text().includes('Price: 11 €')).toBe(true);
    expect(component.find('.product-price').at(1).text().includes('Price: 64 €')).toBe(true);
    expect(component.find('.product-price').last().text().includes('Price: 54 €')).toBe(true);
    expect(component.find('.product-availability').first().text().includes('In Stock')).toBe(true);
    expect(component.find('.product-availability').at(1).text().includes('Less Than 10')).toBe(true);
    expect(component.find('.product-availability').last().text().includes('Out of Stock')).toBe(true);
    component.unmount()
  })
})
