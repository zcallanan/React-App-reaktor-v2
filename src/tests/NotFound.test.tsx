import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import NotFound from "../components/NotFound";

describe("<NotFound /> Component Tests", () => {
  test("Invalid URL displays direction text", () => {
    render(
      <MemoryRouter initialEntries={["/tophats"]}>
        <NotFound />
      </MemoryRouter>,
    );
    expect(
      screen.findByText("To view product information, click on a link above!"),
    );
  });
});
