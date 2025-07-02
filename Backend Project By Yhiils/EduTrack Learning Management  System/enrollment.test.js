
const request = require("supertest");
const app = require("../server");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

jest.mock("../config/db", () => ({
    query: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

describe("Enrollment API", () => {
    let adminToken;
    let facultyToken;
    let studentToken;

    beforeAll(async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
            if (token === "admin_token") {
                callback(null, { user_id: 1, role_name: "Administrator" });
            } else if (token === "faculty_token") {
                callback(null, { user_id: 2, role_name: "Faculty" });
            } else if (token === "student_token") {
                callback(null, { user_id: 4, role_name: "Student" });
            } else {
                callback(new Error("Invalid token"));
            }
        });

        adminToken = "admin_token";
        facultyToken = "faculty_token";
        studentToken = "student_token";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/enrollments", () => {
        it("should return all enrollments for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[
                { enrollment_id: 1, student_id: 4, course_id: 1, enrollment_date: "2025-01-15", status: "Active" },
            ]]);

            const res = await request(app)
                .get("/api/enrollments")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return all enrollments for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[
                { enrollment_id: 1, student_id: 4, course_id: 1, enrollment_date: "2025-01-15", status: "Active" },
            ]]);

            const res = await request(app)
                .get("/api/enrollments")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .get("/api/enrollments")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("POST /api/enrollments", () => {
        it("should create a new enrollment for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[]]); // No existing enrollment
            pool.query.mockResolvedValueOnce([{}]); // Insert enrollment

            const res = await request(app)
                .post("/api/enrollments")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    student_id: 5,
                    course_id: 3,
                    enrollment_date: "2025-01-20",
                    status: "Active",
                });

            expect(res.statusCode).toEqual(201);
            expect(res.text).toContain("Enrollment created successfully.");
        });

        it("should return 403 if not an administrator", async () => {
            const res = await request(app)
                .post("/api/enrollments")
                .set("Authorization", `Bearer ${facultyToken}`)
                .send({
                    student_id: 5,
                    course_id: 3,
                    enrollment_date: "2025-01-20",
                    status: "Active",
                });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("PUT /api/enrollments/:id", () => {
        it("should update an enrollment for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[{ enrollment_id: 1, enrollment_date: "2025-01-15", status: "Active" }]]); // Existing enrollment
            pool.query.mockResolvedValueOnce([{}]); // Update enrollment

            const res = await request(app)
                .put("/api/enrollments/1")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "Completed" });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Enrollment updated successfully.");
        });

        it("should return 403 if not an administrator", async () => {
            const res = await request(app)
                .put("/api/enrollments/1")
                .set("Authorization", `Bearer ${facultyToken}`)
                .send({ status: "Completed" });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("DELETE /api/enrollments/:id", () => {
        it("should delete an enrollment for an administrator", async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .delete("/api/enrollments/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Enrollment deleted successfully.");
        });

        it("should return 403 if not an administrator", async () => {
            const res = await request(app)
                .delete("/api/enrollments/1")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });
});


