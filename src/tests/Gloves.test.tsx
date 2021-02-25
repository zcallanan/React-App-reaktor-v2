import React from "react";
import Gloves from '../components/Gloves';
import PrintJSON from '../components/PrintJSON';
import { MemoryRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react'

describe('<Glove> Component Tests', () => {
  fetchMock.mockResponse(JSON.stringify({"rows":
    [
      {"id":"7c3149c69aeb51e167d6","type":"gloves","name":"AKFOLHEM EARTH","color":"red","price":11,"manufacturer":"juuran","availability":"In Stock"},
      {"id":"da35e621ad262615e2fa9e5","type":"gloves","name":"DALLEAKOL NORMAL","color":"orange","price":64,"manufacturer":"hennex","availability":"Less Than 10"},
      {"id":"1b1610b94d3d1d701b0","type":"gloves","name":"HEMFOLNY SLIP METROPOLIS","color":"black, blue","price":54,"manufacturer":"umpante","availability":"Out of Stock"}
    ]
  }))

  test('Gloves Product Card component text', () => {
    render(<MemoryRouter initialEntries={["/gloves"]} ><Gloves slug="gloves" /></MemoryRouter>);
    expect(screen.findByText('Manufacturer: Juuran'));
    expect(screen.findByText('Manufacturer: Hennex'));
    expect(screen.findByText('Manufacturer: Umpante'));
    expect(screen.findByText('Name: Akfolhem Earth'));
    expect(screen.findByText('Name: Dalleakol Normal'));
    expect(screen.findByText('Name: Hemfolny Slip Metropolis'));
    expect(screen.findByText('Colors: Red'));
    expect(screen.findByText('Colors: Orange'));
    expect(screen.findByText('Colors: Black, Blue'));
    expect(screen.findByText('Price: 11 €'));
    expect(screen.findByText('Price: 64 €'));
    expect(screen.findByText('Price: 54 €'));
    expect(screen.findByText('In Stock'));
    expect(screen.findByText('Less Than 10'));
    expect(screen.findByText('Out of Stock'));
  });

  test('Gloves PrintJSON component text', () => {
    render(<MemoryRouter initialEntries={["/gloves"]} ><Gloves slug="gloves" /></MemoryRouter>);
    expect(screen.findByText('Manufacturer: Juuran'));
    expect(screen.findByText('Manufacturer: Hennex'));
    expect(screen.findByText('Manufacturer: Umpante'));
    expect(screen.findByText('Name: Akfolhem Earth'));
    expect(screen.findByText('Name: Dalleakol Normal'));
    expect(screen.findByText('Name: Hemfolny Slip Metropolis'));
    expect(screen.findByText('Colors: Red'));
    expect(screen.findByText('Colors: Orange'));
    expect(screen.findByText('Colors: Black, Blue'));
    expect(screen.findByText('Price: 11 €'));
    expect(screen.findByText('Price: 64 €'));
    expect(screen.findByText('Price: 54 €'));
    expect(screen.findByText('In Stock'));
    expect(screen.findByText('Less Than 10'));
    expect(screen.findByText('Out of Stock'));
  });
})
