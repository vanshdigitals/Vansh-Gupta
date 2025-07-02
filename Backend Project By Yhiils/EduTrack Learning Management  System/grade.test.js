
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

describe("Grade API", () => {
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

    describe("GET /api/grades", () => {
        it("should return all grades for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[
                { grade_id: 1, enrollment_id: 1, assignment_name: "Midterm", score: 85, letter_grade: "B" },
            ]]);

            const res = await request(app)
                .get("/api/grades")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return all grades for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[
                { grade_id: 1, enrollment_id: 1, assignment_name: "Midterm", score: 85, letter_grade: "B" },
            ]]);

            const res = await request(app)
                .get("/api/grades")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .get("/api/grades")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("POST /api/grades", () => {
        it("should create a new grade for an administrator", async () => {
            pool.query.mockResolvedValueOnce([{}]); // Insert grade

            const res = await request(app)
                .post("/api/grades")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    enrollment_id: 1,
                    assignment_name: "Final Exam",
                    score: 90,
                    letter_grade: "A",
                    graded_by: 2,
                });

            expect(res.statusCode).toEqual(201);
            expect(res.text).toContain("Grade created successfully.");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .post("/api/grades")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({
                    enrollment_id: 1,
                    assignment_name: "Final Exam",
                    score: 90,
                    letter_grade: "A",
                    graded_by: 2,
                });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("PUT /api/grades/:id", () => {
        it("should update a grade for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[{ grade_id: 1, enrollment_id: 1, assignment_name: "Midterm", score: 85 }]]); // Existing grade
            pool.query.mockResolvedValueOnce([{}]); // Update grade

            const res = await request(app)
                .put("/api/grades/1")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ score: 95, letter_grade: "A+" });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Grade updated successfully.");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .put("/api/grades/1")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({ score: 95, letter_grade: "A+" });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("DELETE /api/grades/:id", () => {
        it("should delete a grade for an administrator", async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .delete("/api/grades/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Grade deleted successfully.");
        });

        it("should return 403 if not an administrator", async () => {
            const res = await request(app)
                .delete("/api/grades/1")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });
});


