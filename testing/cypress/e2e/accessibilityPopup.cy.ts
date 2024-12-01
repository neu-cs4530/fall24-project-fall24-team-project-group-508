describe('AccessibilityPopup Component Tests', () => {
    beforeEach(() => {
        // Visit the page containing the AccessibilityPopup
        cy.visit('https://cs4530-f24-508.onrender.com/');

        // login to acc
        cy.contains('Login').should('be.visible');
        cy.get('input[name="username"]').type('test111');
        cy.get('input[name="password"]').type('test');
        cy.contains('Login').click();
    });

    it('should open the modal when triggered', () => {
        // Assuming the modal is opened by a button or action, click on it (adjust selector accordingly)
        cy.get('[data-testid="open-accessibility-popup-btn"]').click();

        // Verify the modal is open
        cy.get('[aria-labelledby="accessibility-dialog-title"]').should('be.visible');
    });

    it('should change the text size when a new option is selected', () => {
        cy.get('[data-testid="open-accessibility-popup-btn"]').click(); // Open the popup

        // Select a text size option
        cy.get('#text-size-label').click(); // Open the text size dropdown
        cy.get('[data-testid="text-size-menu"]').contains('Small').click();

        // Verify the new value is selected
        cy.get('[data-testid="text-size-menu"]').should('have.value', 'small');
    });

    it('should change the theme when a new option is selected', () => {
        cy.get('[data-testid="open-accessibility-popup-btn"]').click();

        // Select a theme
        cy.get('#theme-label').click();
        cy.get('[data-testid="theme-menu"]').contains('Dark').click();

        // Verify the new value is selected
        cy.get('[data-testid="theme-menu"]').should('have.value', 'dark');
    });

    it('should call the onClose function when the close button is clicked', () => {
        cy.get('[data-testid="open-accessibility-popup-btn"]').click();

        // Check if the modal is open
        cy.get('[aria-labelledby="accessibility-dialog-title"]').should('be.visible');

        // Click the close button
        cy.get('[data-testid="close-popup-btn"]').click();

        // Check if the modal is closed
        cy.get('[aria-labelledby="accessibility-dialog-title"]').should('not.exist');
    });

    it('should call the appropriate service when options are selected', () => {
        cy.get('[data-testid="open-accessibility-popup-btn"]').click(); // Open the popup


        // Select a text size option
        cy.get('#text-size-label').click();
        cy.get('[data-testid="text-size-menu"]').contains('Large').click();

        cy.wait('@updateSettings').its('request.body').should('deep.include', {
            textSize: 'large',
        });

        // Select a theme
        cy.get('#theme-label').click();
        cy.get('[data-testid="theme-menu"]').contains('Oceanic').click();

        cy.wait('@updateSettings').its('request.body').should('deep.include', {
            theme: 'oceanic',
        });
    });
});
