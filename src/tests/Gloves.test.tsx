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
      {"id":"da35e621ad262615e2fa9e5","type":"gloves","name":"DALLEAKOL NORMAL","color":"red","price":64,"manufacturer":"juuran","availability":"Less Than 10"},
      {"id":"1b1610b94d3d1d701b0","type":"gloves","name":"HEMFOLNY SLIP METROPOLIS","color":"black","price":54,"manufacturer":"juuran","availability":"Out of Stock"}
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

  test('Glove Product Card components are displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/gloves"]} ><Gloves slug="gloves" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductCard')).toHaveLength(3);
    component.unmount()
  })

  test('Glove product data is displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/gloves"]} ><Gloves slug="gloves" /></MemoryRouter>)
    });
    component.update()
    // console.log(component.debug())
    expect(component.text().includes('Akfolhem Earth')).toBe(true);
    component.unmount()
  })
})
