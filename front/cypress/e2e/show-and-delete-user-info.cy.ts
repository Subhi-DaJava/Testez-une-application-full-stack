import * as cypress from "cypress";
// let valid_jwt =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ5b2dhIiwibmFtZSI6InN1YmkiLCJpYXQiOjE1MTYyMzkwMDI0fQ.djyPs0sacRUeKWqqxkLRubg35W86VhIrI0eTHcX1i_4";

describe('Display user info', () => {

  it('should navigate to /me and display user info', () => {
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'subhi@test.com',
        firstName: 'Subhi',
        lastName: 'Yari',
        admin: false
      },
      // headers: {
      //   'Authorization': `Bearer ${valid_jwt}`
      // }
    }).as('login');

    cy.url().should('include', '/login');

    cy.get('input[formControlName=email]').type("subhi@test.com");
    cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);

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
        }
      ]
      // headers: {
      //   'Authorization': `Bearer ${valid_jwt}`
      // }
    }).as('sessionInformation')

    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'subhi@test.com',
        lastName: 'Yari',
        firstName: 'Subhi',
        admin: false,
        password: '',
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26'
      }

      // headers: {
      //   'Authorization': `Bearer ${valid_jwt}`
      // }
    }).as('user')

    cy.url().should('include', '/sessions');

    cy.get('span').contains('Account').click();

    cy.url().should('include', '/me')

    cy.contains('p', 'Name: Subhi YARI', ).should('be.visible');
    cy.get('h1').contains('User information').should('be.visible');
  });

  it('Should navigate to sessions when click the back button and go back to user account', () => {
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
        }
      ]
    }).as('sessionInformation');

    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'subhi@test.com',
        lastName: 'Yari',
        firstName: 'Subhi',
        admin: false,
        password: '',
        createdAt: '2023-12-25',
        updatedAt: '2021-12-26'
      }
    }).as('user')

    cy.get('[data-testid="arrow_back"]').click();
    cy.url().should('include', '/sessions');
    cy.get('span').should('exist', 'Sessions');

    cy.get('span').contains('Account').click();

    cy.url().should('include', '/me');
  });

  it('should delete User account, then logout', () => {

    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200,
      body: {
        id: 1
      }
    }).as('delete User account');

    cy.get('[data-testid="delete-user"]').contains('Delete').click();
    cy.url().should('include', '/');
  });




});
