INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');

INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
       ('Subhi', 'Yarmemet', false, 'subhi@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
       ('Test', 'TEST', false, 'test@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
       ('TestToBeDeleted', 'TEST_TO_BE_DELETED', false, 'test_delete@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

INSERT INTO SESSIONS (name, description, date, teacher_id, created_at, updated_at)
VALUES  ('Yoga Inspiration', 'Start yoga from ZERO', '2024-01-12', 1, '2024-01-07', '2024-01-07'),
        ('Master Class', 'Become a Yoga Master', '2024-01-13', 2, '2024-01-07', '2024-01-07'),
        ('Yoga for Kids', 'Yoga for Kids', '2024-01-14', 1, '2024-01-07', '2024-01-07');

INSERT INTO PARTICIPATE (user_id, session_id)
VALUES (3, 1),
       (3, 2),
       (1, 3),
       (2, 2);