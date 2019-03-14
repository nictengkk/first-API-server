const request = require("supertest");
const app = require("../../app");

const booksSampleData = [
  { id: "1", name: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "2", name: "Way of the Wolf", author: "Jordan Belfort" },
  { id: "3", name: "Beating the Street", author: "Peter Lynch" }
];

describe("Books", () => {
  describe("/books", () => {
    let route = "/books";
    test("should display list of books", () => {
      return request(app) //access the app
        .get(route)
        .expect(200)
        .expect("Content-type", /json/)
        .expect(booksSampleData);
    });
    test("should add a book", () => {
      return request(app)
        .post(route)
        .set("Accept", "application/json")
        .send({ name: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
        .expect(201)
        .expect({
          id: "4",
          name: "Rich Dad Poor Dad",
          author: "Robert Kiyosaki"
        });
    });
  });

  describe("/books/3", () => {
    let route = "/books/3";
    test("should edit a book's name", () => {
      return request(app)
        .put(route)
        .send({ name: "One Up On Wall Street" })
        .expect(202)
        .expect({ name: "One Up On Wall Street" });
    });
    test("Should delete a book from the db", () => {
      if (route) {
        return request(app)
          .delete(route)
          .expect(202);
      } else if ((route = "/books/50")) {
        return request(app)
          .delete(route)
          .ok(res => res.status === 400)
          .then(res => {
            expect(res.status).toBe(400);
          });
      }
    });
  });

  describe("QUERY", () => {
    let route = "/books";
    test("should return book(s) of the same author", () => {
      return request(app)
        .get(route)
        .query({ author: "Peter Lynch" })
        .expect(200)
        .expect([
          { id: "3", name: "Beating the Street", author: "Peter Lynch" }
        ]);
    });

    test("should return book(s) of the same name", () => {
      return request(app)
        .get(route)
        .query({ name: "Way of the Wolf" })
        .expect(200)
        .expect([
          { id: "2", name: "Way of the Wolf", author: "Jordan Belfort" }
        ]);
    });
  });

  // describe("/books/3", () => {
  //   let route = "/books/3";
  //   test("should update a book", () => {
  //     return request(app)
  //       .put(route)
  //       .send({ name: "mno" })
  //       .expect(202)
  //       .then(res => {
  //         expect(res.body.name).toEqual("mno");
  //         expect(res.body.id).toEqual("3");
  //         expect(res.body.author).toEqual("ghijk");
  // expect(res.body).toEqual({
  //   id: expect.any(String),
  //   name: expect.any(String),
  //   author: expect.any(String)
  // });
  // });
  // .expect({ name: "mno" });
  //     });
  //   });
});

//error handing

// test("fails as there is no such book", () => {
//   return request(app)
//   .delete(route)
//   .ok(res=>res.status === 400)
//   .then(res=>{
//     expect(res.status).toBe(400)
//   })
// });
