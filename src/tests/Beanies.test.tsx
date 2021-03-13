import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Beanies from "../components/Beanies";
import PrintJSON from "../components/PrintJSON";

describe("<Beanies> Component Tests", () => {
  fetchMock.mockResponse(
    JSON.stringify({
      rows: [
        {
          id: "03f808a0c79173c1c934aad3",
          type: "beanies",
          name: "JEREVUP TYRANNUS",
          color: "purple",
          price: 82,
          manufacturer: "ippal",
          availability: "In Stock",
        },
        {
          id: "34a029d74de58141a5c5e9",
          type: "beanies",
          name: "OOTUPTAI RAIN METROPOLIS",
          color: "red",
          price: 96,
          manufacturer: "hennex",
          availability: "Less Than 10",
        },
        {
          id: "668c7c0c10f689f164b",
          type: "beanies",
          name: "HEMOOT BOON",
          color: "grey, green",
          price: 76,
          manufacturer: "abiplos",
          availability: "Out of Stock",
        },
      ],
    }),
  );

  test("Beanies Product Card component text", () => {
    render(
      <MemoryRouter initialEntries={["/beanies"]}>
        <Beanies slug="beanies" />
      </MemoryRouter>,
    );
    expect(screen.findByText("Manufacturer: Ippal"));
    expect(screen.findByText("Manufacturer: Hennex"));
    expect(screen.findByText("Manufacturer: Abiplos"));
    expect(screen.findByText("Name: Jerevup Tyrannus"));
    expect(screen.findByText("Name: Hemoot Boon"));
    expect(screen.findByText("Name: Ootuptai Rain Metropolis"));
    expect(screen.findByText("Colors: Purple"));
    expect(screen.findByText("Colors: Red"));
    expect(screen.findByText("Colors: Grey, Green"));
    expect(screen.findByText("Price: 82 €"));
    expect(screen.findByText("Price: 96 €"));
    expect(screen.findByText("Price: 76 €"));
    expect(screen.findByText("In Stock"));
    expect(screen.findByText("Less Than 10"));
    expect(screen.findByText("Out of Stock"));
  });

  test("Beanies PrintJSON component text", () => {
    render(
      <MemoryRouter initialEntries={["/api/beanies"]}>
        <PrintJSON slug="beanies" />
      </MemoryRouter>,
    );
    expect(screen.findByText("Manufacturer: Ippal"));
    expect(screen.findByText("Manufacturer: Hennex"));
    expect(screen.findByText("Manufacturer: Abiplos"));
    expect(screen.findByText("Name: Jerevup Tyrannus"));
    expect(screen.findByText("Name: Hemoot Boon"));
    expect(screen.findByText("Name: Ootuptai Rain Metropolis"));
    expect(screen.findByText("Colors: Purple"));
    expect(screen.findByText("Colors: Red"));
    expect(screen.findByText("Colors: Grey, Green"));
    expect(screen.findByText("Price: 82 €"));
    expect(screen.findByText("Price: 96 €"));
    expect(screen.findByText("Price: 76 €"));
    expect(screen.findByText("In Stock"));
    expect(screen.findByText("Less Than 10"));
    expect(screen.findByText("Out of Stock"));
  });
});
