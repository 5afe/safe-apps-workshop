import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn App", () => {
  render(<App />);
  const linkElement = screen.getByText(/Safe Apps Workshop/i);
  expect(linkElement).toBeInTheDocument();
});
