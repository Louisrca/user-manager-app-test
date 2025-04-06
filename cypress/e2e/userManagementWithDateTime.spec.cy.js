describe("User Management", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:8000/src/api.php", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Chill Guy",
          email: "chill.guy@mail.com",
          created_at: "2025-04-06 18:26:26",
        },
        {
          id: 2,
          name: "Chill Girl",
          email: "chill.girl@mail.com",
          created_at: "2025-04-06 18:29:12",
        },
      ],
    }).as("getUsers");

    cy.intercept("POST", "http://localhost:8000/src/api.php", {
      statusCode: 201,
      body: { success: true },
    }).as("addUser");

    cy.intercept("PUT", "http://localhost:8000/src/api.php*", {
      statusCode: 200,
      body: { success: true },
    }).as("updateUser");

    cy.intercept("DELETE", "http://localhost:8000/src/api.php*", {
      statusCode: 200,
      body: { success: true },
    }).as("deleteUser");

    cy.visit("http://localhost:8000");
  });

  it("devrait lister les utilisateurs existants avec la date de création", () => {
    cy.wait("@getUsers");

    cy.contains("Chill Guy");
    cy.contains("Chill Girl");
    cy.contains("2025-04-06 18:26:26");
    cy.contains("2025-04-06 18:29:12");
  });

  it("devrait ajouter un nouvel utilisateur", () => {
    cy.get("input[id=name]").type("Chill Boy");
    cy.get("input[id=email]").type("chill.boy@mail.com");
    cy.get("button").contains("Ajouter").click();

    cy.wait("@addUser");
  });

  it("devrait modifier un utilisateur existant", () => {
    cy.get("button").contains("✏️").click();

    cy.get("input[id=name]").clear().type("Chill Guy Updated");
    cy.get("button").contains("Ajouter").click();

    cy.wait("@updateUser");
  });

  it("devrait supprimer un utilisateur", () => {
    cy.get("button").contains("❌").click();

    cy.wait("@deleteUser");
  });
});
