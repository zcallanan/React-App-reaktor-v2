import React from "react";
import Router from '../components/Router';
import Beanies from '../components/Beanies';
import { MemoryRouter } from "react-router-dom";
import { act } from 'react-dom/test-utils';

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

describe('<Beanies> Component Tests', () => {

  fetch.mockResponse(JSON.stringify({"rows":
    [
      {"id":"03f808a0c79173c1c934aad3","type":"beanies","name":"JEREVUP TYRANNUS","color":"purple","price":82,"manufacturer":"ippal","availability":"In Stock"},
      {"id":"34a029d74de58141a5c5e9","type":"beanies","name":"OOTUPTAI RAIN METROPOLIS","color":"red","price":96,"manufacturer":"hennex","availability":"Less Than 10"},
      {"id":"668c7c0c10f689f164b","type":"beanies","name":"HEMOOT BOON","color":"grey, green","price":76,"manufacturer":"abiplos","availability":"Out of Stock"}
    ]
  }))

  test('Beanies Product List component displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/beanies"]} ><Beanies slug="beanies" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductList')).toHaveLength(1);
    component.unmount()
  })

  test('Beanies Product Card components and data are displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/beanies"]} ><Beanies slug="beanies" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductCard')).toHaveLength(3);
    expect(component.find('.product-manufacturer').first().text().includes('Manufacturer: Ippal')).toBe(true);
    expect(component.find('.product-manufacturer').at(1).text().includes('Manufacturer: Hennex')).toBe(true);
    expect(component.find('.product-manufacturer').last().text().includes('Manufacturer: Abiplos')).toBe(true);
    expect(component.find('.product-name').first().text().includes('Name: Jerevup Tyrannus')).toBe(true);
    expect(component.find('.product-name').at(1).text().includes('Name: Ootuptai Rain Metropolis')).toBe(true);
    expect(component.find('.product-name').last().text().includes('Name: Hemoot Boon')).toBe(true);
    expect(component.find('.product-colors').first().text().includes('Colors: Purple')).toBe(true);
    expect(component.find('.product-colors').at(1).text().includes('Colors: Red')).toBe(true);
    expect(component.find('.product-colors').last().text().includes('Colors: Grey, Green')).toBe(true);
    expect(component.find('.product-price').first().text().includes('Price: 82 €')).toBe(true);
    expect(component.find('.product-price').at(1).text().includes('Price: 96 €')).toBe(true);
    expect(component.find('.product-price').last().text().includes('Price: 76 €')).toBe(true);
    expect(component.find('.product-availability').first().text().includes('In Stock')).toBe(true);
    expect(component.find('.product-availability').at(1).text().includes('Less Than 10')).toBe(true);
    expect(component.find('.product-availability').last().text().includes('Out of Stock')).toBe(true);
    component.unmount()
  })
})
