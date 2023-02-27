const http = require("http");
const fs = require("fs");
const args = require("minimist")(process.argv);
const port = args.port;

let homepage = "";
let projectpage = "";
let registrationpage = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homepage = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectpage = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) {
    throw err;
  }
  registrationpage = registration;
});

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectpage);
        response.end();
        break;

      case "/registration":
        response.write(registrationpage);
        response.end();
        break;

      default:
        response.write(homepage);
        response.end();
        break;
    }
  })
  .listen(port);