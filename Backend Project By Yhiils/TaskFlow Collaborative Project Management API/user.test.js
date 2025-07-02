
const request = require('supertest');
const app = require('../server'); // Assuming your main app file is server.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the database pool for testing
jest.mock('../config/db', () => ({
    query: jest.fn(),
}));

// Mock JWT for testing
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));

// Mock bcrypt for testing
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('User API', () => {
    let adminToken;
    let studentToken;

    beforeAll(async () => {
        // Mock successful JWT verification for admin
        jwt.verify.mockImplementation((token, secret, callback) => {
            if (token === 'admin_token') {
                callback(null, { user_id: 1, role_name: 'Administrator' });
            } else if (token === 'student_token') {
                callback(null, { user_id: 4, role_name: 'Student' });
            } else {
                callback(new Error('Invalid token'));
            }
        });

        // Mock successful JWT signing
        jwt.sign.mockReturnValue('test_token');

        // Generate a token for testing authenticated routes
        adminToken = 'admin_token';
        studentToken = 'student_token';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users', () => {
        it('should return all users for an administrator', async () => {
            pool.query.mockResolvedValueOnce([[
                { user_id: 1, first_name: 'Admin', last_name: 'User', email: 'admin@example.com', role_name: 'Administrator' },
                { user_id: 4, first_name: 'Alice', last_name: 'Johnson', email: 'alice@example.com', role_name: 'Student' },
            ]]);

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(pool.query).toHaveBeenCalledWith("SELECT user_id, first_name, last_name, email, role_name FROM users JOIN roles ON users.role_id = roles.role_id");
        });

        it('should return 403 if not an administrator', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain('Access Denied');
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return a user by ID for an administrator', async () => {
            pool.query.mockResolvedValueOnce([[
                { user_id: 4, first_name: 'Alice', last_name: 'Johnson', email: 'alice@example.com', role_name: 'Student' },
            ]]);

            const res = await request(app)
                .get('/api/users/4')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('email', 'alice@example.com');
        });

        it('should return 404 if user not found', async () => {
            pool.query.mockResolvedValueOnce([[]]);

            const res = await request(app)
                .get('/api/users/999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.text).toContain('User not found');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update a user for an administrator', async () => {
            pool.query.mockResolvedValueOnce([[{ user_id: 4, first_name: 'Alice', last_name: 'Johnson', email: 'alice@example.com', role_id: 3 }]]); // Existing user
            pool.query.mockResolvedValueOnce([[{ role_id: 3 }]]); // Role lookup
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // Update operation

            const res = await request(app)
                .put('/api/users/4')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ first_name: 'Alicia' });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain('User updated successfully');
        });

        it('should return 403 if not an administrator', async () => {
            const res = await request(app)
                .put('/api/users/4')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ first_name: 'Alicia' });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain('Access Denied');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user for an administrator', async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .delete('/api/users/4')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain('User deleted successfully');
        });

        it('should return 404 if user not found', async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const res = await request(app)
                .delete('/api/users/999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.text).toContain('User not found');
        });
    });
});


