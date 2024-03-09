/// <reference types="cypress"/>

describe("Musclemate", () => {
  it.skip("Should not login as a client, enter invalid password", () => {
    cy.visit("https://localhost://5173");

    cy.get("a").contains("Entrar").click();

    cy.url().should("include", "/login");

    cy.get("input[name='username']").type("fake@email.com");
    cy.get("input[name='username'").should("have.value", "fake@email.com");

    cy.get("input[name='password']").type("fake@email.com");
    cy.get("input[name='password'").should("have.value", "fake@email.com");

    cy.get("form").contains("Iniciar Sesión").click();
  });

  it("Should register as a client", () => {
    cy.visit("http://localhost:5173");

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
