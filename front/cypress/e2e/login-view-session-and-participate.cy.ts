describe("Participate in a Yoga session", () => {

  it('User Login successful', () => {
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        type: 'Bearer',
        token: 'fake token',
        username:'subhi@test.com',
        firstName: 'Subhi',
        lastName: 'Yari',
        admin: false
      }
    }).as('userSessionInformation')

    cy.url().should('include', '/login');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Session 1',
          date: '2023-12-28',
          description: 'Description for Session 1',
          teacher_id: 1,
          users: [2,3],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1,2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('sessions');

    cy.get('input[formControlName=email]').type("subhi@test.com")
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`)
    cy.url().should('include', '/sessions');
  });

  it('Should navigate to session id 1 and Participate in', () => {

    cy.intercept('POST', '/api/session/1/participate/1', {})
      .as('participate');
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2023-12-28',
        description: 'Description for Session 1',
        teacher_id: 1,
        users: [2,3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26',
      }
    }).as('session-1');

    cy.intercept('GET', '/api/teacher/1', {
      statusCode: 200,
      body: {
        id: 1,
        lastName: 'DELAHAYE',
        firstName: 'Margot',
        createdAt: '2023-12-20',
        updatedAt: '2023-12-20',
      }
    }).as('teacher-1');

    cy.get('[data-session-id="1"]').click();

    cy.get('[data-testid="user-participate"]').click();

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2023-12-28',
        description: 'Description for Session 1',
        teacher_id: 1,
        users: [1,2,3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26',
      }
    }).as('session-1');

    cy.get('[data-testid="user-participate"]').should('exist', 'Do not participate')
  });

  it('Should navigate to session id 1 and cancel participation', () => {

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2023-12-28',
        description: 'Description for Session 2',
        teacher_id: 1,
        users: [1,2,3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26',
      }
    }).as('session-1');

    cy.intercept('GET', '/api/teacher/1', {
      statusCode: 200,
      body: {
        id: 1,
        lastName: 'DELAHAYE',
        firstName: 'Margot',
        createdAt: '2023-12-20',
        updatedAt: '2023-12-20',
      }
    }).as('teacher-1');

    cy.intercept('DELETE', '/api/session/1/participate/1', {})
      .as('unParticipate');

    cy.url().should('include', '/sessions/detail/1');

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2023-12-28',
        description: 'Description for Session 2',
        teacher_id: 1,
        users: [2,3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26',
      }
    }).as('session-1');

    cy.get('[data-testid="user-participate"]').should('exist', 'Participate');

  });

  it('Shoul user logout', () => {
    cy.get('[data-testid="logout-test"]').click();
    cy.url().should('include', '/');
  });
});
