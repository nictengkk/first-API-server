const request = require("supertest");
const app = require("../../app");

const booksSampleData = [
  { id: "1", name: "abc", author: "abcde" },
  { id: "2", name: "def", author: "defgh" },
  { id: "3", name: "ghi", author: "ghijk" }
];

describe("Books", () => {
  let route = "/books";
  test("should display list of books", () => {
    return request(app)
      .get(route)
      .expect(200)
      .expect("Content-type", /json/)
      .expect(booksSampleData);
  });
  test("should add a book", () => {
    return request(app)
      .post(route)
      .set("Accept", "application/json")
      .send({ id: "4", name: "jkl", author: "jklmn" })
      .expect(201)
      .expect({ id: "4", name: "jkl", author: "jklmn" });
  });
});
