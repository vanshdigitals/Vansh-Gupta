
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

describe("Report API", () => {
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

    describe("GET /api/reports/student-performance/:student_id", () => {
        it("should return student performance for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[
                { course_name: "CS101", assignment_name: "Midterm", score: 88.5, letter_grade: "B+" },
            ]]);

            const res = await request(app)
                .get("/api/reports/student-performance/4")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return student performance for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[
                { course_name: "CS101", assignment_name: "Midterm", score: 88.5, letter_grade: "B+" },
            ]]);

            const res = await request(app)
                .get("/api/reports/student-performance/4")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return student performance for the student themselves", async () => {
            pool.query.mockResolvedValueOnce([[
                { course_name: "CS101", assignment_name: "Midterm", score: 88.5, letter_grade: "B+" },
            ]]);

            const res = await request(app)
                .get("/api/reports/student-performance/4")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return 403 if student tries to access another student's performance", async () => {
            const res = await request(app)
                .get("/api/reports/student-performance/5")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("GET /api/reports/course-analytics/:course_id", () => {
        it("should return course analytics for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[{ average_score: 80, min_score: 60, max_score: 95, total_students: 50 }]]);

            const res = await request(app)
                .get("/api/reports/course-analytics/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("average_score");
        });

        it("should return course analytics for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[{ average_score: 80, min_score: 60, max_score: 95, total_students: 50 }]]);

            const res = await request(app)
                .get("/api/reports/course-analytics/1")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("average_score");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .get("/api/reports/course-analytics/1")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("GET /api/reports/student-attendance/:student_id/:course_id", () => {
        it("should return student attendance for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[
                { session_date: "2025-02-01", status: "Present" },
            ]]);

            const res = await request(app)
                .get("/api/reports/student-attendance/4/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return student attendance for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[
                { session_date: "2025-02-01", status: "Present" },
            ]]);

            const res = await request(app)
                .get("/api/reports/student-attendance/4/1")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return student attendance for the student themselves", async () => {
            pool.query.mockResolvedValueOnce([[
                { session_date: "2025-02-01", status: "Present" },
            ]]);

            const res = await request(app)
                .get("/api/reports/student-attendance/4/1")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return 403 if student tries to access another student's attendance", async () => {
            const res = await request(app)
                .get("/api/reports/student-attendance/5/1")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });
});


