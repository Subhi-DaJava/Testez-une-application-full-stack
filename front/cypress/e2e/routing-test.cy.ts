describe('Routing test', () => {
  it('Should navigate to login page without authentication', () => {
    cy.visit('/sessions');
    cy.url().should('include', '/login');
    cy.get('span').should('exist', 'Login');
  });

  it('Should navigate to register page without any authentication', () => {
    cy.visit('/register');
    cy.url().should('include', '/register');
    cy.get('mat-card-title').should('exist', 'Register');
  });

  it('Should display 404 page', () => {
    cy.visit('/not-found-page');
    cy.url().should('include', '/404');
    cy.get('h1').should('exist', 'Page not found !');
  });

});
