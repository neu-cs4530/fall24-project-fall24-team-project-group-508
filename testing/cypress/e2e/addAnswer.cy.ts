import { Q1_DESC, A1_TXT, A2_TXT } from '../../../server/data/posts_strings';

describe("Cypress Tests to verify adding new answers", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("npx ts-node ../server/populate_db.ts mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("npx ts-node ../server/remove_db.ts mongodb://127.0.0.1:27017/fake_so");
  });

  it("5.1 | Created new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Test Answer 1",
      A1_TXT,
      A2_TXT,
    ];
    cy.visit("http://localhost:3000");
    // register for acc
    cy.contains('Need an account? Register').click();
    cy.contains('Create Account').should('be.visible');
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('test');
    cy.contains('Create Account').click();
    cy.visit("http://localhost:3000/home");

    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(answers[0]);
    cy.contains("Post Answer").click();
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
    cy.contains("testuser");
    cy.contains("0 seconds ago");
  });


  it("5.3 | Answer is mandatory when creating a new answer", () => {
    cy.visit("http://localhost:3000");
    // register for acc
    cy.contains('Need an account? Register').click();
    cy.contains('Create Account').should('be.visible');
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('test');
    cy.contains('Create Account').click();
    cy.visit("http://localhost:3000/home");

    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.contains("Post Answer").click();
    cy.contains("Answer text cannot be empty");
  });
});
