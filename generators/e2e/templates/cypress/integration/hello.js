/// <reference types="Cypress" />

import { cyan } from "chalk";

describe("hello", () => {
  it("says hello", () => {
    cy.visit("/client");
    cy.contains("Hello");
  });
});
