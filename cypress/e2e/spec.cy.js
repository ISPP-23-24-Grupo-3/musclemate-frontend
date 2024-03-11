/// <reference types="cypress"/>

describe("Musclemate", () => {
  it("Should login as a regular user", () => {
    cy.visit(Cypress.env("MUSCLE_MATE_URL"));

    cy.get("a").contains("Entrar").click();

    cy.url().should("include", "/login");

    cy.get("input[name='username']").type("pgmarc");
    cy.get("input[name='username'").should("have.value", "pgmarc");

    cy.get("input[name='password']").type("sanfermin");
    cy.get("input[name='password'").should("have.value", "sanfermin");

    cy.url().should("include", "/");

    cy.get("a").contains("Cerrar sesion").click();
    cy.get("a").contains("Entrar");
  });

  it("Should register as a client", () => {
    cy.visit(Cypress.env("MUSCLE_MATE_URL"));

    cy.get("a").contains("Registrarse").click();

    cy.url().should("include", "/register-client");

    cy.get("input[name='userName']").type("John");
    cy.get("input[name='userName'").should("have.value", "John");

    cy.get("input[name='lastName']").type("Doe");
    cy.get("input[name='lastName'").should("have.value", "Doe");

    cy.get("input[name='mail']").type("johndoe@mail.com");
    cy.get("input[name='mail'").should("have.value", "johndoe@mail.com");

    cy.get("input[name='phone']").type("111111111");
    cy.get("input[name='phone'").should("have.value", "111111111");

    cy.get("input[name='address']").type("Example st");
    cy.get("input[name='address'").should("have.value", "Example st");

    cy.get("form").contains("Registrarse").click();
  });
});
