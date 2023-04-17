/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCSRFToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCSRFToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCSRFToken(res);
    res = await agent.post("/users").send({
      firstName: "user",
      lastName: "ab",
      email: "userab@gmail.com",
      password: "12345678",
      "_csrf": csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a new todos", async () => {
    const agent = request.agent(server);
    await login(agent, "userab@gmail.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCSRFToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks as complete with id", async () => {
    const agent = request.agent(server);
    await login(agent, "userab@gmail.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCSRFToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedRes = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedRes.dueToday.length;
    const latestTodo = parsedGroupedRes.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCSRFToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: true,
        "_csrf": csrfToken,
      });
    const parsedUpdateRes= JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateRes.completed).toBe(true);
  });
  test("Deletes a todo with the given ID", async () => {
    const agent = request.agent(server);
    await login(agent, "userab@gmail.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCSRFToken(res);
    await agent.post("/todos").send({
      title: "Buy Chocklate",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedRes= JSON.parse(groupedTodosResponse.text);
    const todoid = parsedRes.dueToday.length;
    const latestTodo = parsedRes.dueToday[todoid - 1];

    res = await agent.get("/todos");
    csrfToken = extractCSRFToken(res);

    const deleteRes = await agent.delete(`/todos/${latestTodo.id}`).send({
      "_csrf": csrfToken,
    });
    const parsedUpdateResponse = JSON.parse(deleteRes.text);
    expect(parsedUpdateResponse).toBe(true);
  });
});