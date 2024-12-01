describe('ProfilePage', () => {
    beforeEach(() => {
        cy.visit('https://cs4530-f24-508.onrender.com/');

        // login to acc
        cy.contains('Login').should('be.visible');
        cy.get('input[name="username"]').type('test111');
        cy.get('input[name="password"]').type('test');
        cy.contains('Login').click();

        cy.get('[data-testid="open-profile-popup-btn"]').click();
    });

    it('should render the profile picture', () => {
        cy.get('svg[data-testid="PersonOutlineIcon"]').should('be.visible');
    });

    it('should display the user name and score', () => {
        cy.get('label').contains('name:').should('exist');
        cy.get('label').contains('score:').should('exist');

        cy.get('label').contains('name: testUser').should('exist');
        cy.get('label').contains('score: 0').should('exist');
    });

    it('should apply correct styles based on the theme', () => {
        cy.get('div.profile-page')
            .should('have.css', 'background-color')
            .and('eq', 'rgb(255, 255, 255)');

        cy.get('div.profile-page')
            .should('have.css', 'color')
            .and('eq', 'rgb(0, 0, 0)');
    });
});
