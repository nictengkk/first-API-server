const request = require("supertest");
const app = require("../../app");

const booksSampleData = [
  { id: "1", title: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "2", title: "Way of the Wolf", author: "Jordan Belfort" },
  { id: "3", title: "Beating the Street", author: "Peter Lynch" }
];

describe("[GET] Books", () => {
  let route = "/books";
  test("should display list of books", () => {
    return request(app) //access the app
      .get(route)
      .expect(200)
      .expect("Content-type", /json/)
      .expect(booksSampleData);
  });
  // test("should add a book", () => {
  //   return request(app)
  //     .post(route)
  //     .set("Accept", "application/json")
  //     .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
  //     .expect(201)
  //     .expect({
  //       id: "4",
  //       title: "Rich Dad Poor Dad",
  //       author: "Robert Kiyosaki"
  //     });
  // });
});

describe("/books/3", () => {
  let route = "/books/3";
  test("should edit a book's title", () => {
    return request(app)
      .put(route)
      .send({ title: "One Up On Wall Street" })
      .expect(202)
      .expect({ title: "One Up On Wall Street" });
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
        { id: "3", title: "Beating the Street", author: "Peter Lynch" }
      ]);
  });

  test("should return book(s) of the same title", () => {
    return request(app)
      .get(route)
      .query({ title: "Way of the Wolf" })
      .expect(200)
      .expect([
        { id: "2", title: "Way of the Wolf", author: "Jordan Belfort" }
      ]);
  });
});

// describe("/books/3", () => {
//   let route = "/books/3";
//   test("should update a book", () => {
//     return request(app)
//       .put(route)
//       .send({ title: "mno" })
//       .expect(202)
//       .then(res => {
//         expect(res.body.title).toEqual("mno");
//         expect(res.body.id).toEqual("3");
//         expect(res.body.author).toEqual("ghijk");
// expect(res.body).toEqual({
//   id: expect.any(String),
//   title: expect.any(String),
//   author: expect.any(String)
// });
// });
// .expect({ title: "mno" });
//     });
//   });

//error handing

// test("fails as there is no such book", () => {
//   return request(app)
//   .delete(route)
//   .ok(res=>res.status === 400)
//   .then(res=>{
//     expect(res.status).toBe(400)
//   })
// });

describe("[POST] Creates a new book", () => {
  let route = "/books";
  test("denies access when no token is provided", () => {
    return request(app)
      .post(route)
      .set("Content-type", "application/json")
      .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
      .ok(res => res.status === 403)
      .then(res => {
        expect(res.status).toBe(403);
      });
  });

  test("deny access when incorrect token is given", () => {
    return request(app)
      .post(route)
      .set("Authorization", "Bearer some-invalid-token")
      .set("Content-type", "application/json")
      .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
      .ok(res => res.status === 403)
      .then(res => {
        expect(res.status).toBe(403);
      });
  });

  test("grants access when correct token is given", () => {
    return request(app)
      .post(route)
      .set("Authorization", "Bearer my-awesome-token")
      .set("Content-type", "application/json")
      .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: expect.any(String),
          author: expect.any(String)
        });
      });
  });
});
