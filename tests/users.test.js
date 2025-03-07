const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");
const database = require("../database");
afterAll(() => database.end());
describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
});
describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");
    expect(response.status).toEqual(404);
  });
});
describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Rondoudou",
      lastname: "Grodoudou",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "New York",
      language: "Doudoudoudou",
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );
    const [userInDatabase] = result;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
    expect(userInDatabase.lastname).toStrictEqual(newUser.lastname);
    expect(userInDatabase.email).toStrictEqual(newUser.email);
    expect(userInDatabase.city).toStrictEqual(newUser.city);
    expect(userInDatabase.language).toStrictEqual(newUser.language);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Pikachu" };
    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
    expect(response.status).toEqual(422);
  });
});
describe("PUT /api/users/:id", () => {
  it("should edit users", async () => {
    const newUser = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );
    const id = result.insertId;
    const updatedUser = {
      firstname: "Max",
      lastname: "Alan ",
      email: "esffes@gmail.com",
      city: "Nantes",
      language: "français",
    };
    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);
    expect(response.status).toEqual(204);
    const [users] = await database.query(
      "SELECT * FROM users WHERE id=?",
      id
    )
    const [userInDatabase] = users;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.title).toStrictEqual(updatedUser.title);
    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.director).toStrictEqual(updatedUser.director);
    expect(userInDatabase).toHaveProperty("year");
    expect(userInDatabase.year).toStrictEqual(updatedUser.email);
    expect(userInDatabase).toHaveProperty("color");
    expect(userInDatabase.color).toStrictEqual(updatedUser.city);
    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.duration).toStrictEqual(updatedUser.duration);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { title: "Harry Potter" };
    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);
    expect(response.status).toEqual(422);
  });
  it("should return no user", async () => {
    const newUser = {
      firstname: "Jack",
      lastname: "Sparrow ",
      email: "jacks@gmail.com",
      city: "Guatemala",
      language: "Anglais",
    };
    const response = await request(app).put("/api/users/0").send(newUser);
    expect(response.status).toEqual(404);
  });
});
describe("DELETE /api/users/:id", () => {
  it('should delete a user by ID and return 204', async () => {
    const response = await request(app)
      .delete('/api/users/:id')
      .send({ id: deleteUser });
    expect(response.status).toBe(204);
  });
  it('should return 404 for non-existing user ID', async () => {
    const response = await request(app)
      .delete('/api/users/:id')
      .send({ id: deleteUser });
    expect(response.status).toBe(404);
  });
});