
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

describe("Course API", () => {
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

    describe("GET /api/courses", () => {
        it("should return all courses for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[
                { course_id: 1, course_name: "CS101" },
                { course_id: 2, course_name: "MA201" },
            ]]);

            const res = await request(app)
                .get("/api/courses")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return all courses for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[
                { course_id: 1, course_name: "CS101" },
            ]]);

            const res = await request(app)
                .get("/api/courses")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return all courses for a student", async () => {
            pool.query.mockResolvedValueOnce([[
                { course_id: 1, course_name: "CS101" },
            ]]);

            const res = await request(app)
                .get("/api/courses")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe("POST /api/courses", () => {
        it("should create a new course for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[]]); // No existing course
            pool.query.mockResolvedValueOnce([{}]); // Insert course

            const res = await request(app)
                .post("/api/courses")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    course_code: "PH101",
                    course_name: "Introduction to Philosophy",
                    credits: 3.0,
                    faculty_id: 2,
                });

            expect(res.statusCode).toEqual(201);
            expect(res.text).toContain("Course created successfully.");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .post("/api/courses")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({
                    course_code: "PH101",
                    course_name: "Introduction to Philosophy",
                    credits: 3.0,
                    faculty_id: 2,
                });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("PUT /api/courses/:id", () => {
        it("should update a course for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[{ course_id: 1, course_code: "CS101", course_name: "Intro to CS", credits: 3.0 }]]); // Existing course
            pool.query.mockResolvedValueOnce([{}]); // Update course

            const res = await request(app)
                .put("/api/courses/1")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ course_name: "Introduction to Computer Science" });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Course updated successfully.");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .put("/api/courses/1")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({ course_name: "Introduction to Computer Science" });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("DELETE /api/courses/:id", () => {
        it("should delete a course for an administrator", async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .delete("/api/courses/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Course deleted successfully.");
        });

        it("should return 403 if not an administrator", async () => {
            const res = await request(app)
                .delete("/api/courses/1")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });
});


