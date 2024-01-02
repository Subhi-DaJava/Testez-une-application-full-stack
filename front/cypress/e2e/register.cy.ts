describe('Register testing', () => {
  it('Register successfully', () => {

    cy.visit('/')
    cy.get('span').contains('Register').click()

    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      body: {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'new@gmail.com',
        password: 'test!1234'
      },
    })
    cy.url().should('include', '/register')
    cy.intercept(
      {
        method: 'GET',
        url: '/api/auth/login',
      },
      []).as('login')

    cy.get('input[formControlName=firstName]').type("firstName")
    cy.get('input[formControlName=lastName]').type("lastName")
    cy.get('input[formControlName=email]').type("new@gmail.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/login')

  })
});
