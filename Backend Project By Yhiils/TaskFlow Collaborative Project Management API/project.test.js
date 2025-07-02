const request = require("supertest");
const { app, server, io } = require("../server");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

let token;
let userId;
let projectId;

describe("Project API", () => {
    beforeAll(async () => {
        // Clear projects and users table before tests
        await pool.query("DELETE FROM projects");
        await pool.query("DELETE FROM users");

        // Register a test user
        await request(server)
            .post("/api/auth/register")
            .send({
                username: "projectuser",
                email: "project@example.com",
                password: "password123",
            });

        // Login the test user to get a token
        const res = await request(server)
            .post("/api/auth/login")
            .send({
                email: "project@example.com",
                password: "password123",
            });
        token = res.body.accessToken;

        // Get user ID
        const [users] = await pool.query("SELECT user_id FROM users WHERE email = ?", ["project@example.com"]);
        userId = users[0].user_id;
    });

    it("should create a new project", async () => {
        const res = await request(server)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                project_name: "Test Project",
                description: "This is a test project.",
                start_date: "2024-01-01",
                end_date: "2024-12-31",
                status: "Active",
            });
        expect(res.statusCode).toEqual(201);
        expect(res.text).toEqual("Project created successfully.");

        const [projects] = await pool.query("SELECT project_id FROM projects WHERE project_name = ?", ["Test Project"]);
        projectId = projects[0].project_id;
    });

    it("should get all projects", async () => {
        const res = await request(server)
            .get("/api/projects")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("project_name", "Test Project");
    });

    it("should get a project by ID", async () => {
        const res = await request(server)
            .get(`/api/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("project_name", "Test Project");
    });

    it("should update a project", async () => {
        const res = await request(server)
            .put(`/api/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                project_name: "Updated Project Name",
                status: "Completed",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("Project updated successfully.");

        const [updatedProject] = await pool.query("SELECT project_name, status FROM projects WHERE project_id = ?", [projectId]);
        expect(updatedProject[0].project_name).toEqual("Updated Project Name");
        expect(updatedProject[0].status).toEqual("Completed");
    });

    it("should delete a project", async () => {
        const res = await request(server)
            .delete(`/api/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual("Project deleted successfully.");

        const [deletedProject] = await pool.query("SELECT * FROM projects WHERE project_id = ?", [projectId]);
        expect(deletedProject.length).toEqual(0);
    });
});


