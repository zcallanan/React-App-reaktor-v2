import React from "react";
import Facemasks from '../components/Facemasks';
import PrintJSON from '../components/PrintJSON';
import { MemoryRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react'

describe('<Facemasks> Component Tests', () => {
  fetchMock.mockResponse(JSON.stringify({"rows":
    [
      {"id":"ccd1da35142c4d7ece61b7","type":"facemasks","name":"AKTAIFOL FANTASY","color":"white","price":11,"manufacturer":"niksleh","availability":"In Stock"},
      {"id":"1fc9a15517b1d22953c","type":"facemasks","name":"EMAK FLOWER","color":"purple, black","price":45,"manufacturer":"okkau","availability":"Less Than 10"},
      {"id":"6825e2648c4af44cf971a4","type":"facemasks","name":"MOHEMLEA ROOM","color":"blue, green","price":94,"manufacturer":"laion","availability":"Out of Stock"}
    ]
  }))

  test('Facemasks Product Card component text', () => {
    render(<MemoryRouter initialEntries={["/facemasks"]} ><Facemasks slug="facemasks" /></MemoryRouter>);
    expect(screen.findByText('Manufacturer: Niksleh'));
    expect(screen.findByText('Manufacturer: Okkau'));
    expect(screen.findByText('Manufacturer: Laion'));
    expect(screen.findByText('Name: Aktaifol Fantasy'));
    expect(screen.findByText('Name: Mohemlea Room'));
    expect(screen.findByText('Name: Emak Flower'));
    expect(screen.findByText('Colors: White'));
    expect(screen.findByText('Colors: Purple, Black'));
    expect(screen.findByText('Colors: Blue, Green'));
    expect(screen.findByText('Price: 11 €'));
    expect(screen.findByText('Price: 45 €'));
    expect(screen.findByText('Price: 94 €'));
    expect(screen.findByText('In Stock'));
    expect(screen.findByText('Less Than 10'));
    expect(screen.findByText('Out of Stock'));
  });

  test('Facemasks PrintJSON component text', () => {
    render(<MemoryRouter initialEntries={["/api/facemasks"]} ><PrintJSON slug="facemasks" /></MemoryRouter>);
    expect(screen.findByText('Manufacturer: Niksleh'));
    expect(screen.findByText('Manufacturer: Okkau'));
    expect(screen.findByText('Manufacturer: Laion'));
    expect(screen.findByText('Name: Aktaifol Fantasy'));
    expect(screen.findByText('Name: Mohemlea Room'));
    expect(screen.findByText('Name: Emak Flower'));
    expect(screen.findByText('Colors: White'));
    expect(screen.findByText('Colors: Purple, Black'));
    expect(screen.findByText('Colors: Blue, Green'));
    expect(screen.findByText('Price: 11 €'));
    expect(screen.findByText('Price: 45 €'));
    expect(screen.findByText('Price: 94 €'));
    expect(screen.findByText('In Stock'));
    expect(screen.findByText('Less Than 10'));
    expect(screen.findByText('Out of Stock'));
  });
})
