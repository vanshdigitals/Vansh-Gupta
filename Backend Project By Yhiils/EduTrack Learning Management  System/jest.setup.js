
const app = require("./server");
let server;

beforeAll((done) => {
  server = app.listen(3001, () => {
    console.log("Test server running on port 3001");
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log("Test server closed");
    done();
  });
});


