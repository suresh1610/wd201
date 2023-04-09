/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

const extractCSRFToken = (html) => {
  const $ = cheerio.load(html);
  return $("[name=_csrf]").val();
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

  test("Creates a  new todo", async () => {
    const { text } = await agent.get("/");
    const csrfToken = extractCSRFToken(text);

    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo complete with the given ID", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);
    await agent.post("/todos").send({
      title: "Wash Dishes",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedTodosRes = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponses = JSON.parse(groupedTodosRes.text);
    const latestItem = parsedResponses[parsedResponses.length - 1];

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const markCompleted = await agent.put(`/todos/${latestItem.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });

    const parsedUpdatedResponse = JSON.parse(markCompleted.text);
    expect(parsedUpdatedResponse.completed).toBe(true);
  });

  test("Deletes a todo with the given ID", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);

    await agent.post("/todos").send({
      title: "Complete levels",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const getRes = await agent.get("/todos");
    const parsedResponses = JSON.parse(getRes.text);
    const todoitemID = parsedResponses[parsedResponses.length - 1].id;

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const deleteTodo = await agent.delete(`/todos/${todoitemID}`).send({
      _csrf: csrfToken,
    });
    expect(deleteTodo.statusCode).toBe(200);
  });
});