import React from "react";
import Router from '../components/Router';
import NotFound from '../components/NotFound';
import { MemoryRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react'

describe('<NotFound /> Component Tests', () => {
  test('Invalid URL displays direction text', () => {
    render(<MemoryRouter initialEntries={["/tophats"]} ><NotFound/></MemoryRouter>);
    expect(screen.findByText('To view product information, click on a link above!'));
  })
})

