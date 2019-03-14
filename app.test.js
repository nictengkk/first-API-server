const request = require("supertest");
const app = require("./app");

describe("Homepage", () => {
  test("should display welcome to the HomePage with status code 200", done => {
    request(app)
      .get("/")
      .expect(200)
      .expect("Welcome to the HomePage", done);
  });
  test("should display welcome to the Books Inventory with status code 200", done => {
    request(app)
      .get("/books")
      .expect(200)
      .expect("Welcome to the Books Inventory", done);
  });
});
