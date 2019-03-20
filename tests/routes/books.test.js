const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const Book = require("../../models/books");

const route = (params = "") => {
  const path = "/api/v1/books";
  return `${path}/${params}`;
};

describe("Books", () => {
  let mongoServer;
  let db;

  beforeEach(async () => {
    await Book.insertMany([
      {
        title: "The Intelligent Investor",
        author: "Benjamin Graham"
      },
      { title: "Way of the Wolf", author: "Jordan Belfort" },
      { title: "Beating the Street", author: "Peter Lynch" }
    ]);
  });

  beforeAll(async () => {
    jest.setTimeout(120000); //in case each default test timeout of 5s is not enough for the async to complete.
    mongoServer = new MongoMemoryServer(); //start mongodb in test mode
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri);
    db = mongoose.connection;
  });

  afterEach(async () => {
    await db.dropCollection("books");
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("[GET] Search for books", () => {
    test("should display list of books", () => {
      const expectedBooks = [
        {
          title: "The Intelligent Investor",
          author: "Benjamin Graham"
        },
        { title: "Way of the Wolf", author: "Jordan Belfort" },
        { title: "Beating the Street", author: "Peter Lynch" }
      ];

      return request(app) //access the app
        .get(route())
        .expect(200)
        .expect("Content-type", /json/)
        .then(res => {
          const books = res.body;
          expect(books.length).toBe(3);
          books.forEach((book, index) => {
            expect(book).toEqual(expect.objectContaining(expectedBooks[index]));
          });
        });
    });

    test("returns books matching the title query", () => {
      return request(app)
        .get(route())
        .query({ title: "The Intelligent Investor" })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => {
          const book = res.body[0];
          expect(book.title).toEqual("The Intelligent Investor");
        });
    });

    test("returns books matching the author query", () => {
      const expectedBooks = [
        {
          title: "The Intelligent Investor",
          author: "Benjamin Graham"
        },
        { title: "Way of the Wolf", author: "Jordan Belfort" },
        { title: "Beating the Street", author: "Peter Lynch" }
      ];

      return request(app)
        .get(route())
        .query({ author: "Jordan Belfort" })
        .expect("content-type", /json/)
        .expect(200)
        .then(res => {
          const books = res.body;
          books.forEach((book, index) => {
            expect(book.title).toBe(expectedBooks[index].title);
            expect(book.author).toBe(expectedBooks[index].author);
          });
        });
    });

    // xtest("should display book(s) of different author and title queries", async () => {
    //   const expectedBooks = [
    //     {
    //       title: "Beating the Street",
    //       author: "Peter Lynch"
    //     },
    //     { title: "Way of the Wolf", author: "Jordan Belfort" }
    //   ];

    //   await request(app)
    //     .get(route())
    //     .query({ author: "Peter Lynch", title: "Way of the Wolf" })
    //     .expect(200)

    //     .then(res => {
    //       const books = res.body;
    //       books.forEach((book, index) => {
    //         expect(book).toEqual(expect.objectContaining(expectedBooks[index]));
    //       });
    //     });
    // });
  });

  describe("[POST] Creates a new book entry", () => {
    const expectedBooks = [
      {
        title: "The Intelligent Investor",
        author: "Benjamin Graham"
      },
      { title: "Way of the Wolf", author: "Jordan Belfort" }
    ];
    test("denies access when no token is provided", async () => {
      await request(app)
        .post(route())
        .set("Content-type", "application/json")
        .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
        .catch(res => {
          expect(res.status).toBe(403);
        });
    });

    test("denies access when incorrect token is given", async () => {
      await request(app)
        .post(route())
        .set("Authorization", "Bearer some-invalid-token")
        .set("Content-type", "application/json")
        .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
        });
    });

    test("grants access when correct token is given", async () => {
      const res = await request(app)
        .post(route())
        .set("Authorization", "Bearer my-awesome-token")
        .set("Content-type", "application/json")
        .send({ title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" })
        .expect(201);

      expect(res.body.title).toBe("Rich Dad Poor Dad");
      expect(res.body.author).toBe("Robert Kiyosaki");

      const book = await Book.findOne({ title: "Rich Dad Poor Dad" });
      expect(book.title).toBe("Rich Dad Poor Dad");
    });
  });

  describe("[PUT] Edits an existing book entry", () => {
    test("denies access when no token is provided", async () => {
      const { _id } = await Book.findOne({ title: "The Intelligent Investor" });
      return request(app)
        .put(route(_id))
        .send({
          title: "One up on Wall Street",
          author: "Peter Lynch"
        })
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
        });
    });

    test("denies access when invalid token is provided", async () => {
      const { _id } = await Book.findOne({ title: "The Intelligent Investor" });
      return request(app)
        .put(route(_id))
        .set("Authorization", "Bearer some-invalid-token")
        .send({
          title: "One up on Wall Street",
          author: "Peter Lynch"
        })
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
        });
    });

    test("Successfully edit a book's title with the correct token", async () => {
      //const {_id} = await Book.findOne({title: "The Intelligent Investor"})
      const _id = await request(app)
        .get(route())
        .query({ title: "The Intelligent Investor" })
        .expect(200)
        .then(res => {
          const { _id } = res.body[0];
          return _id;
        });

      // const res = await request(app)
      //   .put(route(_id))
      //   .set("Authorization", "Bearer my-awesome-token")
      //   .send({
      //     title: "Security Analysis",
      //     author: "Benjamin Graham"
      //   })
      //   .expect(202);
      // expect(res.body).toEqual(
      //   expect.objectContaining({
      //     title: "Security Analysis",
      //     author: "Benjamin Graham"
      //   })
      // );
      return request(app)
        .put(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .send({
          title: "Security Analysis",
          author: "Benjamin Graham"
        })
        .expect(202)
        .then(res => {
          expect(res.body).toEqual(
            expect.objectContaining({
              title: "Security Analysis",
              author: "Benjamin Graham"
            })
          );
        });
    });

    test("Fails to edit book as no such id despite valid token", () => {
      const _id = "5c8fb5c41529bf25dcba41a7";
      return request(app)
        .put(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .send({
          title: "One up on Wall Street",
          author: "Peter Lynch"
        })
        .catch(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  describe("[DELETE] Deletes an existing book entry", () => {
    test("denies access when no token is provided", async () => {
      const { _id } = await Book.findOne({ title: "The Intelligent Investor" });
      await request(app)
        .delete(route(_id))
        .ok(res => res.status === 403)
        .then(res => {
          expect(res.status).toBe(403);
        });
    });

    test("Successfully delete a book entry", async () => {
      const { _id } = await Book.findOne({ title: "Way of the Wolf" });

      await request(app)
        .delete(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .expect(202);

      const book = await Book.findOne({ _id });
      expect(book).toBe(null);
    });

    test("Fails to delete a book as it does not exist", async () => {
      const _id = "5c8fb5c41529bf25dcba41a7";

      await request(app)
        .delete(route(_id))
        .set("Authorization", "Bearer my-awesome-token")
        .ok(res => res.status === 404)
        .then(res => {
          expect(res.status).toBe(404);
        });
    });
  });
});
