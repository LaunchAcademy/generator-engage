/// <reference types="Cypress" />

describe("As a user visiting the sign in page", () => {
  const visitSignInPage = () => {
    cy.visit("/user-sessions/new");
  };

  before(() => {
    cy.task("db:truncate", "User");
    cy.task("db:insert", {
      modelName: "User",
      json: { email: "user@example.com", password: "password" },
    });
  });

  it("If I provide a valid email and password, I will be signed in", () => {
    visitSignInPage();
    cy.get("form").within(() => {
      cy.findByLabelText("Email").type("user@example.com");

      cy.findByLabelText("Password").type("password");

      cy.root().submit();

      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
    cy.contains("Sign Out");
  });

  it("If I provide an invalid email and password, I will remain on the same page", () => {
    visitSignInPage();
    cy.get("form").within(() => {
      cy.findByLabelText("Email").type("just@a.joke");
      cy.findByLabelText("Password").type("password");
      cy.root().submit();

      cy.url().should("eq", `${Cypress.config().baseUrl}/user-sessions/new`);
    });
  });

  it("I will see an error message when no email is provided", () => {
    visitSignInPage();
    cy.get("form").within(() => {
      cy.findByLabelText("Password").type("password");
      cy.root().submit();

      cy.contains("is invalid");
    });
  });
});
