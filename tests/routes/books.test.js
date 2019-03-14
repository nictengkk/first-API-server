const request = require("supertest");
const app = require("../../app");

const booksSampleData = [
  { name: "abc", author: "abcde" },
  { name: "def", author: "defgh" },
  { name: "ghi", author: "ghijk" }
];

describe("Books", () => {
  let route = "/books";
  test("should display list of books ", done => {
    return request(app)
      .get(route)
      .expect(200)
      .expect("Content-type", /json/)
      .expect(booksSampleData, done);
  });
});
