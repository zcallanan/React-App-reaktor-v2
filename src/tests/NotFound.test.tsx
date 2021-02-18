import React from "react";
import Router from '../components/Router';
import NotFound from '../components/NotFound';
import { MemoryRouter } from "react-router-dom";

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

describe('<NotFound /> Component Tests', () => {
  test('Router renders one NotFound component', () => {
    const component = mount(<MemoryRouter initialEntries={["/v2/tophats"]} ><Router  /></MemoryRouter>)
    expect(component.find(NotFound)).toHaveLength(1);
    component.unmount();
  })

  test('Invalid URL displays direction text', () => {
    const component = mount(<MemoryRouter initialEntries={["/v2/tophats"]} ><Router  /></MemoryRouter>)
    expect(component.text().includes('To view product information, click on a link above!')).toBe(true);
    component.unmount();
  })
})

