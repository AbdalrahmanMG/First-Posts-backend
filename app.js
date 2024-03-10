const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv/config");
const api = process.env.API_URL;
const port = process.env.PORT;
const postsRouter = require("./routers/posts");
const categoryRouter = require("./routers/categories");
const userRouter = require("./routers/users");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//routes
app.use(`${api}/posts`, postsRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/users`, userRouter);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`server is running on porter ${port}`);
});

// GsnysDe7mj19BL5I
