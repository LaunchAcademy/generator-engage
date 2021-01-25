/// <reference types="Cypress" />

describe("hello", () => {
  it("says hello", () => {
    cy.visit("/client");
    cy.contains("Hello");
  });
});
