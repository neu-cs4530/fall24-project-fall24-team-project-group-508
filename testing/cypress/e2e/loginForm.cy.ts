describe('Login Form Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('renders the login form by default', () => {
        cy.contains('Login').should('be.visible');
        cy.get('form').within(() => {
            cy.get('input[name="username"]').should('exist');
            cy.get('input[name="password"]').should('exist');
            cy.contains('Login').should('exist');
        });
    });

    it('allows user to switch to registration form', () => {
        cy.contains('Need an account? Register').click();
        cy.contains('Create Account').should('be.visible');
        cy.get('form').within(() => {
            cy.get('input[name="username"]').should('exist');
            cy.get('input[name="email"]').should('exist');
            cy.get('input[name="password"]').should('exist');
            cy.contains('Create Account').should('exist');
        });
    });

    it('allows user to switch back to login form', () => {
        cy.contains('Need an account? Register').click();
        cy.contains('Create Account').should('be.visible');

        cy.contains('Have an account? Login').click();
        cy.contains('Login').should('be.visible');
        cy.get('form').within(() => {
            cy.get('input[name="username"]').should('exist');
            cy.get('input[name="password"]').should('exist');
            cy.contains('Login').should('exist');
        });
    });

    it('displays an error message for invalid login credentials', () => {
        cy.get('input[name="username"]').type('invalid_user');
        cy.get('input[name="password"]').type('wrong_password');
        cy.contains('Login').click();

        // Simulate an error response
        cy.intercept('POST', '/login/login', {
            statusCode: 401,
            body: { error: 'Invalid credentials' },
        });

        cy.contains('Invalid credentials').should('be.visible');
    });

    it('submits the login form successfully with valid data', () => {
        cy.get('input[name="username"]').type('valid_user');
        cy.get('input[name="password"]').type('correct_password');
        cy.contains('Login').click();

        // Simulate a successful response
        cy.intercept('POST', '/login/login', {
            statusCode: 200,
            body: { message: 'Login successful' },
        });

        // Check for redirection or success message
        cy.contains('Login successful').should('be.visible');
    });

    it('submits the registration form successfully', () => {
        cy.contains('Need an account? Register').click();

        cy.get('input[name="username"]').type('new_user');
        cy.get('input[name="email"]').type('new_user@example.com');
        cy.get('input[name="password"]').type('secure_password');
        cy.contains('Create Account').click();

        // Simulate a successful response
        cy.intercept('POST', '/login/createAccount', {
            statusCode: 200,
            body: { message: 'Account created successfully' },
        });

        cy.contains('Account created successfully').should('be.visible');
    });

    it('displays an error message for invalid registration input', () => {
        cy.contains('Need an account? Register').click();

        cy.get('input[name="email"]').type('invalid_email'); // Invalid email
        cy.contains('Create Account').click();

        // Simulate error response
        cy.intercept('POST', '/login/createAccount', {
            statusCode: 400,
            body: { error: 'Invalid registration data' },
        });

        cy.contains('Invalid registration data').should('be.visible');
    });
});
