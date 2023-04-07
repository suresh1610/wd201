const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set("View engine", "ejs");

app.get("/", async (request, response) => {
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  response.render("index.ejs", {
    title: "Todo application",
    overdue,
    dueToday,
    dueLater,
  });
});

app.use(express.static(path.join(__dirname, "public"))); //make directory path for css file;

app.get("/todos", function (request, response) {
  response.send("Todo List", request.body);
});

app.get("/todos", async (_request, response) => {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.getAllTodos();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("creating new todo", request.body);
  try {
    // eslint-disable-next-line no-unused-vars
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      commpleted: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("delete a todo with ID:", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ suceess: true });
  } catch (error) {
    return response.status(422).json(false);
  }
});

module.exports = app;
