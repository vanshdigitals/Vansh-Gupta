
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

describe("Attendance API", () => {
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

    describe("GET /api/attendance", () => {
        it("should return all attendance records for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[
                { attendance_id: 1, enrollment_id: 1, session_date: "2025-02-01", status: "Present" },
            ]]);

            const res = await request(app)
                .get("/api/attendance")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return all attendance records for a faculty member", async () => {
            pool.query.mockResolvedValueOnce([[
                { attendance_id: 1, enrollment_id: 1, session_date: "2025-02-01", status: "Present" },
            ]]);

            const res = await request(app)
                .get("/api/attendance")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .get("/api/attendance")
                .set("Authorization", `Bearer ${studentToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("POST /api/attendance", () => {
        it("should create a new attendance record for an administrator", async () => {
            pool.query.mockResolvedValueOnce([{}]); // Insert attendance

            const res = await request(app)
                .post("/api/attendance")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    enrollment_id: 1,
                    session_date: "2025-02-05",
                    status: "Present",
                    recorded_by: 2,
                });

            expect(res.statusCode).toEqual(201);
            expect(res.text).toContain("Attendance record created successfully.");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .post("/api/attendance")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({
                    enrollment_id: 1,
                    session_date: "2025-02-05",
                    status: "Present",
                    recorded_by: 2,
                });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("PUT /api/attendance/:id", () => {
        it("should update an attendance record for an administrator", async () => {
            pool.query.mockResolvedValueOnce([[{ attendance_id: 1, enrollment_id: 1, session_date: "2025-02-01", status: "Present" }]]); // Existing attendance
            pool.query.mockResolvedValueOnce([{}]); // Update attendance

            const res = await request(app)
                .put("/api/attendance/1")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ status: "Absent" });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Attendance record updated successfully.");
        });

        it("should return 403 if not an administrator or faculty", async () => {
            const res = await request(app)
                .put("/api/attendance/1")
                .set("Authorization", `Bearer ${studentToken}`)
                .send({ status: "Absent" });

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });

    describe("DELETE /api/attendance/:id", () => {
        it("should delete an attendance record for an administrator", async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .delete("/api/attendance/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain("Attendance record deleted successfully.");
        });

        it("should return 403 if not an administrator", async () => {
            const res = await request(app)
                .delete("/api/attendance/1")
                .set("Authorization", `Bearer ${facultyToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.text).toContain("Access Denied");
        });
    });
});


