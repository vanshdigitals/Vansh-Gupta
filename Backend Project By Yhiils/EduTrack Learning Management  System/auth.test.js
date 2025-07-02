
const request = require("supertest");
const app = require("../server");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../config/db", () => ({
    query: jest.fn(),
}));
jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

describe("Auth API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            pool.query.mockResolvedValueOnce([[]]); // No existing user
            pool.query.mockResolvedValueOnce([[{ role_id: 3 }]); // Student role
            bcrypt.hash.mockResolvedValueOnce("hashedpassword");
            pool.query.mockResolvedValueOnce([{}]); // Insert user

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    first_name: "Test",
                    last_name: "User",
                    email: "test@example.com",
                    password: "password123",
                    role_name: "Student",
                });

            expect(res.statusCode).toEqual(201);
            expect(res.text).toContain("User registered successfully.");
        });

        it("should return 409 if user already exists", async () => {
            pool.query.mockResolvedValueOnce([[{ email: "test@example.com" }]]); // Existing user

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    first_name: "Test",
                    last_name: "User",
                    email: "test@example.com",
                    password: "password123",
                    role_name: "Student",
                });

            expect(res.statusCode).toEqual(409);
            expect(res.text).toContain("User with this email already exists.");
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    first_name: "Test",
                    last_name: "User",
                    email: "test@example.com",
                    role_name: "Student",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login a user successfully and return a token", async () => {
            pool.query.mockResolvedValueOnce([[{ user_id: 1, email: "test@example.com", password_hash: "hashedpassword", role_name: "Student" }]]);
            bcrypt.compare.mockResolvedValueOnce(true);
            jwt.sign.mockReturnValueOnce("mocked_jwt_token");

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "password123",
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("accessToken", "mocked_jwt_token");
        });

        it("should return 400 for invalid credentials (user not found)", async () => {
            pool.query.mockResolvedValueOnce([[]]);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "nonexistent@example.com",
                    password: "password123",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.text).toContain("Invalid credentials.");
        });

        it("should return 400 for invalid credentials (incorrect password)", async () => {
            pool.query.mockResolvedValueOnce([[{ user_id: 1, email: "test@example.com", password_hash: "hashedpassword", role_name: "Student" }]]);
            bcrypt.compare.mockResolvedValueOnce(false);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "wrongpassword",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.text).toContain("Invalid credentials.");
        });

        it("should return 400 if email or password are missing", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });
    });
});


