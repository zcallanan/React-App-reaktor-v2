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
      {"id":"34a029d74de58141a5c5e9","type":"beanies","name":"OOTUPTAI RAIN METROPOLIS","color":"red","price":96,"manufacturer":"abiplos","availability":"Less Than 10"},
      {"id":"668c7c0c10f689f164b","type":"beanies","name":"HEMOOT BOON","color":"grey","price":76,"manufacturer":"abiplos","availability":"Out of Stock"}
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

  test('Beanies Product Card components are displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/beanies"]} ><Beanies slug="beanies" /></MemoryRouter>)
    });
    component.update()
    expect(component.find('ProductCard')).toHaveLength(3);
    component.unmount()
  })

  test('Beanies product data is displayed', async () => {
    let component;
    await act( async () => {
      component = mount(<MemoryRouter initialEntries={["/v2/beanies"]} ><Beanies slug="beanies" /></MemoryRouter>)
    });
    component.update()
    expect(component.text().includes('Hemoot Boon')).toBe(true);
    component.unmount()
  })
})
