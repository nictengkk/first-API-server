const request = require("supertest");
const app = require("../../app");

const booksSampleData = [
  { id: "1", title: "The Intelligent Investor", author: "Benjamin Graham" },
  { id: "2", title: "Way of the Wolf", author: "Jordan Belfort" },
  { id: "3", title: "Beating the Street", author: "Peter Lynch" }
];

const route = (params = "") => {
  const path = "/api/v1/books";
  return `${path}/${params}`;
};

describe("[GET] Search for books", () => {
  test("should display list of books", () => {
    return request(app) //access the app
      .get(route())
      .expect(200)
      .expect("Content-type", /json/)
      .expect(booksSampleData);
  });

  test("should display book(s) of different author and title queries", () => {
    return request(app)
      .get(route())
      .query({ author: "Peter Lynch", title: "Way of the Wolf" })
      .expect(200)
      .expect([
        { id: "2", title: "Way of the Wolf", author: "Jordan Belfort" },
        { id: "3", title: "Beating the Street", author: "Peter Lynch" }
      ]);
  });
});

describe("[POST] Creates a new book entry", () => {
  test("denies access when no token is provided", () => {
    return request(app)
      .post(route())
      .set("Content-type", "application/json")
      .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
      .catch(res => {
        expect(res.status).toBe(403);
      });
  });

  test("denies access when incorrect token is given", () => {
    return request(app)
      .post(route())
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
      .post(route())
      .set("Authorization", "Bearer my-awesome-token")
      .set("Content-type", "application/json")
      .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: "Rich Dad Poor Dad",
          author: "Robert Kiyosaki"
        });
      });
  });
});

describe("[PUT] Edits an existing book entry", () => {
  test("denies access when no token is provided", () => {
    const id = 3;
    return request(app)
      .put(route(id))
      .send({
        id: `${id}`,
        name: "One up on Wall Street",
        author: "Peter Lynch"
      })
      .ok(res => res.status === 403)
      .then(res => {
        expect(res.status).toBe(403);
      });
  });

  test("denies access when invalid token is provided", () => {
    const id = 3;
    return request(app)
      .put(route(id))
      .set("Authorization", "Bearer some-invalid-token")
      .send({
        id: `${id}`,
        name: "One up on Wall Street",
        author: "Peter Lynch"
      })
      .ok(res => res.status === 403)
      .then(res => {
        expect(res.status).toBe(403);
      });
  });

  test("Successfully edit a book's title with the correct token", () => {
    const id = 3;
    return request(app)
      .put(route(id))
      .set("Authorization", "Bearer my-awesome-token")
      .send({
        id: `${id}`,
        name: "One up on Wall Street",
        author: "Peter Lynch"
      })
      .expect(202)
      .expect({
        id: `${id}`,
        name: "One up on Wall Street",
        author: "Peter Lynch"
      });
  });

  test("Fails to edit book as no such id despite valid token", () => {
    const id = 100;
    return request(app)
      .put(route(id))
      .set("Authorization", "Bearer my-awesome-token")
      .send({
        id: `${id}`,
        name: "One up on Wall Street",
        author: "Peter Lynch"
      })
      .catch(res => {
        expect(res.status).toBe(403);
      });
  });
});

describe("[DELETE] Deletes an existing book entry", () => {
  test("Successfully delete a book entry", () => {
    const id = 3;
    return request(app)
      .delete(route(id))
      .expect(202);
  });

  test("Fails to delete a book as it does not exist", () => {
    const id = 100;

    return request(app)
      .delete(route(id))
      .ok(res => res.status === 400)
      .then(res => {
        expect(res.status).toBe(400);
      });
  });
});
