describe('Simple user login spec', () => {
  it('Should User login be successful', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'subhi@test.com',
        firstName: 'Subhi',
        lastName: 'Yari',
        admin: false
      }
    }).as('userSessionInformation');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Session 1',
          date: '2023-12-28',
          description: 'Description for Session 1',
          teacher_id: 1,
          users: [],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 2,
          users: [1],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
      ]
    }).as('sessions');
    cy.url().should('include', '/login');

    cy.get('input[formControlName=email]').type("subhi@test.com")
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`)

    cy.url().should('include', '/sessions')
    cy.get('span').should('exist', 'Logout');
    cy.get('[data-testid="logout-test"]').should('exist', 'Logout');
  })
});
