describe('CRUD session', () => {

  it('should navigate to /login and login', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        type: 'Bearer',
        token: 'fake token',
        username: 'subhi@test.com',
        firstName: 'Subhi',
        lastName: 'Yari',
        admin: true
      }
    }).as('adminSessionInformation');
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
          users: [2, 3],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('sessions');

    cy.get('input[formControlName=email]').type("subhi@test.com")
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`)
    cy.url().should('include', '/sessions');
    cy.get('[data-testid="create"]').should('exist', 'Create')
    cy.get('[data-testid="edit-button"]').should('exist', 'Edit')

  });

  it('should navigate to /sessions and create a session', () => {
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Session 1',
          date: '2023-12-28',
          description: 'Description for Session 1',
          teacher_id: 1,
          users: [2, 3],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('sessions');

    cy.intercept('POST', '/api/session', {
      statusCode: 200,
      body: {
        id: 3,
        name: 'Session 3',
        date: '2023-12-28',
        description: 'Description for Session 3',
        teacher_id: 1,
        users: [],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26',
      }
    }).as('createSession');

    cy.intercept('GET', '/api/teacher', {
      statusCode: 200,
      body: [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2023-12-20',
          updatedAt: '2023-12-20',
        },
        {
          id: 2,
          lastName: 'YARI',
          firstName: 'Subhi',
          createdAt: '2023-12-20',
          updatedAt: '2023-12-20',
        }]
    }).as('teachers');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Session 1',
          date: '2023-12-28',
          description: 'Description for Session 1',
          teacher_id: 1,
          users: [2, 3],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 3,
          name: 'Session 3',
          date: '2023-12-28',
          description: 'Description for Session 3',
          teacher_id: 1,
          users: [],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('sessions');

    cy.url().should('include', '/sessions');

    cy.get('[data-testid="create"]').click();

    cy.url().should('include', '/sessions/create');

    cy.get('input[formControlName=name]').type("Session 3");
    cy.get('input[formControlName=date]').type("2023-12-28");
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('textarea[formControlName=description]').type("Description for Session 3");

    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/sessions');
  });

  it("should navigate to /sessions and update a session", () => {

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2023-12-28',
        description: 'Description for Session 1',
        teacher_id: 1,
        users: [2, 3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26',
      }
    }).as('session-1');

    cy.intercept('PUT', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1 updated',
        date: '2023-12-28',
        description: 'Description for Session 1 updated',
        teacher_id: 2,
        users: [2,3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-31',
      }
    }).as('updateSession');

    cy.intercept('GET', '/api/teacher', {

      statusCode: 200,
      body: [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2023-12-20',
          updatedAt: '2023-12-20',
        },
        {
          id: 2,
          lastName: 'YARI',
          firstName: 'Subhi',
          createdAt: '2023-12-20',
          updatedAt: '2023-12-20',
        }]
    }).as('teachers');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Session 1 updated',
          date: '2023-12-31',
          description: 'Description for Session 1 updated',
          teacher_id: 2,
          users: [2,3],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-31',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 3,
          name: 'Session 3',
          date: '2023-12-28',
          description: 'Description for Session 3',
          teacher_id: 1,
          users: [],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('updatedSessions');

    cy.url().should('include', '/sessions');

    cy.get('[data-edit-id="1"]').click();

    cy.url().should('include', '/sessions/update/1');

    cy.get('input[formControlName=name]').clear().type("Session 1 updated");
    cy.get('input[formControlName=date]').clear().type("2023-12-31");
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Subhi YARI').click();
    cy.get('textarea[formControlName=description]').clear().type("Description for Session 1 updated");

    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/sessions');

  });

  it('should navigate to /sessions and delete a session', () => {

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Session 1 updated',
          date: '2023-12-31',
          description: 'Description for Session 1 updated',
          teacher_id: 2,
          users: [2,3],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-31',
        },
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 3,
          name: 'Session 3',
          date: '2023-12-28',
          description: 'Description for Session 3',
          teacher_id: 1,
          users: [],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('updatedSessions');

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1 updated',
        date: '2023-12-31',
        description: 'Description for Session 1 updated',
        teacher_id: 2,
        users: [2,3],
        createdAt: '2023-12-25',
        updatedAt: '2021-12-31',
      }
    }).as('session-1');

    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200,
      body: {}
    }).as('deleteSession');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 2,
          name: 'Session 2',
          date: '2023-12-28',
          description: 'Description for Session 2',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        },
        {
          id: 3,
          name: 'Session 3',
          date: '2023-12-28',
          description: 'Description for Session 3',
          teacher_id: 1,
          users: [],
          createdAt: '2023-12-25',
          updatedAt: '2021-12-26',
        }
      ]
    }).as('sessions');

    cy.get('[data-session-id="1"]').click();

    cy.url().should('include', '/sessions');
    cy.url().should('include', '/sessions/detail/1');

    cy.get('[data-testid="delete-button"]').click();

    cy.url().should('include', '/sessions');

  });

});
