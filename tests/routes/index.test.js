const request = require("supertest");
const app = require("../../app");

describe("index", () => {
  test("should display Welcome to the HomePage", done => {
    return request(app)
      .get("/")
      .expect(200)
      .expect("Welcome to the HomePage", done);
  });
});
